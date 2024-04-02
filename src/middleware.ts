import { withAuth } from 'next-auth/middleware'

export {default} from 'next-auth/middleware'

// export default withAuth({
//     callbacks: {
//         authorized: async ({ req, token }) => {
//           if (req.nextUrl.pathname.startsWith("/notes")) return token?.role === "user";
//           return !!token;
//         },
//       },
// })

export const config = {
    matcher: ['/notes', '/notes/:path*'],
    // matcher: ['/_', '/_/:path*'],
}