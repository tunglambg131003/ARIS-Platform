# Updated to Next 13

## !!! IMPORTANT !!!

1. **Environment Variables**: If you don't already have a `.env.local` file at the root of the project, please create one. Inside, you should define the following variables:

   MONGODB_URI=your_mongo_db_uri_here
   NEXTAUTH_SECRET=
   DO_ORIGIN=
   DO_KEY=
   DO_SECRET=
   DO_BUCKET=

2. **Project Structure**:

   - **Page Routes**: All future pages should be placed within the `/app` folder.
   - **Components**: All components should be created within the `/src` folder.
   - **Page Layouts**: We've introduced a new folder `/src/page-layouts` which will encapsulate all the components before they get shipped to `/app`. The pages inside `/app` should be kept minimalistic; refer to the current pages for guidance.
   - **Styles**: All style files should be added to the `/styles` folder.

3. **Naming Conventions**:

   - **Components**: All components should be named in CamelCase with the first letter capitalized (e.g., `MyComponent.js`).
   - **Styles**: Any specific naming conventions for styles should be adhered to within the `/styles` folder.

4. **Library Migration**:

   - We've migrated from `next-auth` to use `next-auth/next` and `next-auth/react`. If you're working with authentication, please refer to their respective documentations to familiarize yourself with the changes.

5. **Library Migration**:

   - Modify and add feature screen as well as the recent to `HomePageTest.js`. all the styles and reference are located in the `/styles` folder,
   - Image of the related content were placed in `src/theme/home_page`.

6. **Some helpful resources**:
   - [NextJS /app router](https://nextjs.org/docs/app)
   - [Auth with NextAuth and Next 13](https://medium.com/ascentic-technology/authentication-with-next-js-13-and-next-auth-9c69d55d6bfd)
   - [NextAuth Configs](https://next-auth.js.org/configuration/nextjs)
