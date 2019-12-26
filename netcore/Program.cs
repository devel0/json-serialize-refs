using System;
using Newtonsoft.Json;

public class anotherObj
{
    public string strVal { get; set; } = "some";
}

public class testObj
{
    public DateTime dt { get; set; }
    public bool boolTrue { get; set; } = true;
    public bool boolFalse { get; set; } = false;
    public double nr { get; set; } = 3.14159;
    public anotherObj aobj { get; set; } = new anotherObj();
    public testObj selftest { get; set; }
    public string value { get; set; } = "sample string";
    public object[] arrdata { get; set; }
    public object[] selfarray { get; set; }
    public object[] arrdata2 { get; set; }

    public testObj()
    {
        dt = new DateTime(2019, 12, 31, 23, 59, 59, DateTimeKind.Utc);
        selftest = this;
        arrdata = new object[] { this, "other" };
        selfarray = arrdata;
        arrdata2 = new object[] { arrdata, "another" };
    }
}

namespace testar
{
    class Program
    {
        static void Main(string[] args)
        {
            var preserveMode = PreserveReferencesHandling.All;

            if (args.Length > 0 && args[0] == "objs") preserveMode = PreserveReferencesHandling.Objects;

            var obj = new testObj();
            var q = JsonConvert.SerializeObject(obj, new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                PreserveReferencesHandling = preserveMode
            });
            System.Console.WriteLine(q);
            System.IO.File.WriteAllText("test1-preserve-out.json", q);
        }
    }
}
