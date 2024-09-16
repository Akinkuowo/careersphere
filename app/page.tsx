import { PostForm } from "./components/post-form/page";
import { UserInformation } from "./components/user-information/page";


export default function Home() {
  return (
    <div className="grid grid-cols-8 mt-5 sm:py-5">
      <section className="hidden md:inline md:col-span-2 ml-4">
        <UserInformation />
      </section>
      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">
        <PostForm />
        {/* <div className="bg-red-500">
          Hello
        </div> */}
      </section>
      <section className="hidden xl:inline justify-center col-span-2">

      </section>
    </div>
  );
}
