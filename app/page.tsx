import Image from "next/image";
import Link from 'next/link'
import Email from "../components/email";
import Header from "../components/header";
import { MainStyle } from "./common";
import { TESTIMONIALS } from "./data";

const bold = (text: string) => <span className="font-semibold">{text}</span>

const HEADER_FIRST = <p>As a former {bold("Amazonian")} devoted to helping customers and solving problems, Selçuk brings a strong sense of ownership and a track record of delivering results.</p>
const HEADER_SECOND = <p>With over seven years of experience developing applications on {bold("AWS")}, he has a proven ability to take on technical duties from operations to development and architecture.</p>

const hiringLinks = () => {
  const className = "w-44 lg:w-56 rounded-md bg-secondary-2 dark:bg-secondary-3 text-black dark:text-white ring-gray-300 hover:bg-secondary-3 dark:hover:bg-secondary-2 px-2.5 py-1.5 lg:text-xl text-base shadow-sm ring-1 ring-inset"
  return (
    <>
      <Link href="https://www.toptal.com/resume/selcuk-cihan" target="blank">
        <button type="button" className={className}>Hire me on Toptal</button>
      </Link>
      <Link href="https://www.upwork.com/freelancers/~01852fc4c9119af2d7" target="blank">
        <button type="button" className={className}>Hire me on Upwork</button>
      </Link>
    </>
  )
}

export default function Home() {
  const iconStyle = "h-6 w-6 lg:h-8 lg:w-8"
  return (
    <main className={MainStyle}>
      <Header selected="home"/>
      <div className="px-4 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-16">
        <div className="p-2 lg:p-4 flex flex-row lg:flex-col items-center">
          <Image
            src={`/profile.png`}
            alt="Selçuk Cihan"
            width={160}
            height={160}
            className="rounded-full selc-image-container relative top-2 lg:top-0" />
          <div className="px-6 lg:px-0 py-1 lg:py-2 lg:grow text-center lg:flex lg:flex-col">
            <p className="py-1 lg:py-2 text-2xl lg:text-4xl">Selçuk Cihan</p>
            <div className="py-1 lg:py-2 text-xl lg:grow">
              <p>Software Engineer</p>
              <p className="block lg:hidden text-base italic">ex-Amazon</p>
            </div>
            <Email className="hidden lg:block py-2 text-3xl font-extralight underline underline-offset-8"/>
          </div>
          <div className="flex flex-col gap-x-8 gap-y-4 lg:flex-row lg:pt-2 justify-center items-center">
            <a href="https://github.com/selcukcihan" target="#blank"><GithubIcon className={iconStyle}/></a>
            <a href="https://linkedin.com/in/selcukcihan" target="#blank"><LinkedinIcon className={iconStyle}/></a>
            <a className="hidden lg:block" href="https://stackoverflow.com/users/4281182" target="#blank"><StackoverflowIcon className={iconStyle}/></a>
            <a className="hidden lg:block" href="https://twitter.com/scihan" target="#blank"><TwitterIcon className={iconStyle}/></a>
          </div>
        </div>
        <div className="hidden lg:flex lg:flex-col p-4 text-xl font-extralight text-justify items-center">
          <div className="grow content-evenly">
            {HEADER_FIRST}
            <br/>
            {HEADER_SECOND}
          </div>
          <div className="flex gap-x-8">
            {hiringLinks()}
          </div>
        </div>
        <div className="flex flex-row lg:flex-col gap-x-12 items-center justify-center">
          <a target="#blank" href="https://www.credly.com/badges/f2b93002-0754-4e37-8d31-031d2d520ee3">
            <Image
              src={`/architect.png`}
              alt="AWS Solutions Architect Professional Certificate"
              className="selc-image-container m-2 lg:m-8"
              width={160}
              height={160} />
          </a>
          <a target="#blank" href="https://www.credly.com/badges/3fb06d81-a97f-4182-ada1-bdcc221152de">
            <Image
              src={`/developer.png`}
              alt="AWS Developer Associate Certificate"
              className="selc-image-container m-2 lg:m-8"
              width={160}
              height={160} />
          </a>
        </div>
      </div>
      <div className="lg:hidden text-center">
      <Email className="text-2xl font-light pb-4 underline underline-offset-4"/>
        <div className="flex justify-center gap-x-2">
          {hiringLinks()}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial, idx) => (
            <Testimonial key={idx} {...testimonial} />
          ))}
      </div>
      </div>
    </main>
  );
}

const Testimonial = (props: any) => (
  <div className="grid grid-col-1 h-64 lg:h-72 m-4 lg:m-8 p-4 justify-self-center bg-primary-0 dark:bg-secondary-1 shadow-lg rounded-sm shadow-secondary-1 dark:shadow-black text-sm lg:text-base text-justify text-pretty">
    <p className="font-light italic lg:pt-10">{props.text}</p>
    <p className="font-light self-end lg:pb-5 text-center">{props.author}</p>
    <Link href={props.link} className="place-self-center">
      <button type="button" className="w-24 rounded-md bg-secondary-2 dark:bg-secondary-3 text-black dark:text-white ring-gray-300 hover:bg-secondary-3 dark:hover:bg-secondary-2 px-2.5 py-1.5 text-xs shadow-sm ring-1 ring-inset">Read more</button>
    </Link>
  </div>
)

const GithubIcon = (props: any) => (
  <svg {...props} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
)

const LinkedinIcon = (props: any) => (
  <svg {...props} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)

const TwitterIcon = (props: any) => (
  <svg {...props} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
)

const StackoverflowIcon = (props: any) => (
  <svg {...props} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Stack Overflow</title><path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z"/></svg>
)
