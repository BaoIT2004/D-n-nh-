// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Mvc.Filters;
// using MyLogin.Exceptions;

// namespace MyLogin.Filters
// {
//     public class LoginExceptionFilter : IExceptionFilter
//     {
//         public void OnException(ExceptionContext context)
//         {
//             var errMessage = context.Exception.Message;

//             if (context.Exception is LoginException)
//             {
//                 context.Result = new ObjectResult(new
//                 {
//                     success = false,
//                     message = errMessage
//                 })
                
//                 {
//                     StatusCode = 400
//                 };
//                 context.ExceptionHandled = true;
//             }
//         }
//     }
// }