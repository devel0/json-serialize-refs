export enum PreserveType { Objects, All }

export function createRefs(obj: any, preserveType: PreserveType = PreserveType.Objects) {
  const map = new Map<object, string>();

  function sweep(val: any): any {
    if (typeof val === "object" && val !== null) {
      const id = String(map.size + 1);

      if (Object.prototype.toString.apply(val) === "[object Array]") { // ARRAY                
        if (preserveType === PreserveType.All) map.set(val, id);

        switch (preserveType) {
          case PreserveType.Objects: // ARRAY : preserve Objects
            {
              const marr = [];
              for (let i = 0; i < val.length; ++i) {
                const V = val[i];
                const backRef = map.get(V);
                if (backRef) {
                  marr[i] = {
                    $ref: backRef,
                  };
                } else {
                  marr[i] = sweep(V);
                }
              }
              return marr;
            }

          case PreserveType.All: // ARRAY : preserve All
            {
              const marrValues = [];
              const marr = {
                $id: id,
                $values: marrValues,
              };
              for (let i = 0; i < val.length; ++i) {
                const V = val[i];
                const backRef = map.get(V);
                if (backRef) {
                  marrValues[i] = {
                    $ref: backRef,
                  };
                } else {
                  marrValues[i] = sweep(V);
                }
              }
              return marr;
            }
        }

      } else { // OBJECT

        if (val instanceof Date) {
          return val;
        } else {
          map.set(val, id);

          const mobj = { $id: id };

          for (const name in val) {
            if (Object.prototype.hasOwnProperty.call(val, name)) {
              const V = val[name];
              const backRef = map.get(V);
              if (backRef) {
                mobj[name] = {
                  $ref: backRef,
                };
              } else {
                mobj[name] = sweep(V);
              }
            }
          }

          return mobj;
        }
      }
    }
    return val; // PRIMITIVE
  }

  const res = sweep(obj);

  return res;
}

/** convert given obj to json resolving references as specified by preserveType ( NewtonJson NET compatible ) */
export function stringifyRefs(obj: any, replacer: any = null, space: any = null, preserveType: PreserveType = PreserveType.Objects) {
  return JSON.stringify(createRefs(obj, preserveType), replacer, space);
}

export function replaceRefs(obj: any) {
  const map = new Map<string, object>();

  const jsonDateFormat = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

  function sweep(val: any) {
    const id = val.$id;
    if (typeof id === "string") {
      map.set(id, val);
      delete val.$id;
    }

    if (val && typeof val === "object") {
      if (Object.prototype.toString.apply(val) === "[object Array]") {
        for (let i = 0; i < val.length; ++i) {
          const item = val[i];
          if (item && typeof item === "object") {
            const ref = item.$ref;
            if (typeof ref === "string") {
              val[i] = map.get(ref);
            } else sweep(item);
          }
        }
      } else {
        for (const name in val) {
          if (name) {
            const tOf = typeof val[name];
            if (tOf === "string") {
              const str: string = val[name];
              if (jsonDateFormat.test(str)) val[name] = new Date(str);
            } else if (tOf === "object") {
              const item = val[name];
              if (item) {
                const values = item.$values;
                if (values !== undefined) {
                  const id = item.$id;
                  if (typeof id === "string" &&
                    Object.prototype.toString.apply(values) === "[object Array]") {
                    map.set(id, values);
                    delete val.$values;
                    val[name] = values;
                    sweep(values);
                  }
                } else {
                  const ref = item.$ref;
                  if (typeof ref === "string") {
                    val[name] = map.get(ref);
                  } else sweep(item);
                }
              }
            }
          }
        }
      }
    }
  }

  sweep(obj);

  return obj;
}

/** convert back from json to object reconnecting references if any ( Newtonsoft JSON compatible ) */
export function parseRefs(text: string, reviver?: (this: any, key: string, value: any) => any) {
  return replaceRefs(JSON.parse(text, reviver));
}

/** helper for fetch json text and parse */
export function parseRefsResponse<T = any>(jsonPromise: Promise<string>): Promise<T> {
  const promise = new Promise<T>((resolve, reject) => {
    jsonPromise.then((json) => {
      resolve(parseRefs(json) as T);
    }).catch((reason) => {
      reject(reason);
    });
  });
  return promise;
}