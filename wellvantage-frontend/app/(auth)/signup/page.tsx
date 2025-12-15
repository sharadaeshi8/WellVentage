import BrandLogo from "@/components/BrandLogo";

export default function SignUpPage() {
  return (
    <div className="min-h-screen lg:grid grid-cols-2">
      {/* Left panel */}
      <div className="relative bg-green-600 text-white flex items-center justify-center p-8">
        <a
          href="/"
          aria-label="Back to home"
          className="absolute left-4 top-4 text-2xl leading-none opacity-90 hover:opacity-100"
        >
          ←
        </a>
        <div className="flex flex-col items-center gap-3.5">
          {/* App icon or brand mark */}
          {/* <div className="rounded-2xl bg-white/10 p-4"> */}
          {/* Use the existing vector brand mark */}
          <BrandLogo
            size={"100%"}
            className=" w-auto lg:w-[278px] h-[100px] lg:h-[248px]"
          />
          {/* </div> */}
          <div className="text-2xl lg:text-4xl font-semibold text-neutral-700">
            Wellvantage
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-[460px] max-w-full flex flex-col gap-10 lg:gap-20">
          <div className="flex flex-col gap-5 text-center">
            <h1 className="text-xl lg:text-3xl font-semibold text-neutral-700">
              Sign Up
            </h1>
            <p className="text-lg lg:text-2xl font-semibold text-neutral-700">
              Welcome! Manage, Track and Grow your Gym with Wellvantage.
            </p>
          </div>

          {/* Continue with Google */}
          <a
            href="/api/auth/google"
            className="mx-auto inline-flex items-center justify-center gap-3 w-full max-w-[320px] h-11 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 shadow-sm"
          >
            {/* Google G icon (SVG) */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.04 12.2615C23.04 11.4451 22.9661 10.6619 22.8286 9.91357H12V14.3569H18.1894C17.922 15.795 17.1114 17.0184 15.888 17.8348V20.7136H19.64C21.8057 18.717 23.04 15.7637 23.04 12.2615Z"
                fill="#4285F4"
              />
              <path
                d="M12 23.5C15.24 23.5 17.9566 22.4269 19.64 20.7137L15.888 17.8349C14.98 18.4449 13.7343 18.8269 12 18.8269C8.87571 18.8269 6.23057 16.8099 5.28857 14.0469H1.42V17.0211C3.09314 20.7779 7.21257 23.5 12 23.5Z"
                fill="#34A853"
              />
              <path
                d="M5.28861 14.0469C5.04861 13.4369 4.90932 12.7779 4.90932 12.0869C4.90932 11.3959 5.04861 10.7369 5.28861 10.1269V7.15271H1.42C0.690857 8.70608 0.272858 10.351 0.272858 12.0869C0.272858 13.8229 0.690857 15.4678 1.42 17.0211L5.28861 14.0469Z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.34714C13.8914 5.34714 15.5314 6.00614 16.8 7.21743L19.7314 4.286H19.64C17.9566 2.57371 15.24 1.5 12 1.5C7.21257 1.5 3.09314 4.22286 1.42 7.97957L5.28857 10.9537C6.23057 8.19086 8.87571 6.17386 12 6.17386V5.34714Z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </a>
        </div>
      </div>
    </div>
  );
}
