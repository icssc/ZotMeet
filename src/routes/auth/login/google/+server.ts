// import { dev } from "$app/environment";
// import { googleAuth } from "$lib/server/lucia";

// export const GET = async ({ cookies, locals }) => {
// if (!event.locals.user) {
// 	return new Response(null, {
// 		status: 401
// 	});
// }

//   const session = await locals.auth.validate();

//   if (session) {
//     return new Response(null, {
//       status: 302,
//       headers: {
//         Location: "/",
//       },
//     });
//   }
//   const [url, state] = await googleAuth.getAuthorizationUrl();

//   // Store state.
//   cookies.set("google_oauth_state", state, {
//     httpOnly: true,
//     secure: !dev,
//     path: "/",
//     maxAge: 30 * 24 * 60 * 60,
//   });

//   return new Response(null, {
//     status: 302,
//     headers: {
//       Location: url.toString(),
//     },
//   });
// };
