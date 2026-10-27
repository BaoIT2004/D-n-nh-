
using WebApplication1.Models;

public class AddStatusTask
{
    public int Id {get;set;}
    public required string StatusTask {get;set;}

    public int ProjectId {get;set;}
    public newProject? Project {get;set;}

}