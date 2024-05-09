import Image from "next/image";
import Link from 'next/link'
import Email from "../components/email";

const HEADER_FIRST = "As a former Amazonian devoted to helping customers and solving problems, Selçuk brings a strong sense of ownership and a track record of delivering results."
const HEADER_SECOND = "With over seven years of experience developing applications on AWS, he has a proven ability to take on technical duties from operations to development and architecture."

const TESTIMONIALS = [
  {
    text: "“I had the pleasure to manage and to work with Selcuk Cihan for the past 2 years while at Tellimer. He rose brilliantly to all challenges thrown at him both technically and communication wise. I would say his superpower is his communications skills, both writing and talking.“",
    author: "Decebal Dobrica - Software Architect, Tellimer",
    full: `I had the pleasure to manage and to work with Selcuk Cihan for the past 2 years while at Tellimer. He rose brilliantly to all challenges thrown at him both technically and communication wise. I would say his superpower is his communications skills, both writing and talking. As a manager I had very little to ask of him as he is independent and knows how to exercise his ownership of a technical product by documenting the developments, the current state, technical debt and possible improvements to a system he works on. I relied heavily on his ever improving know-how around aws technologies in particular, but not exclusively, using typescript/javascript SDKs.`
  },
  {
    text: "“I've been most impressed by his exceptional ability to tackle every phase of software development with in-depth knowledge, confidence and clear communication. I cannot emphasize enough how good Selcuk is at communicating in a clear and structured manner.”",
    author: "Daniel Vliegenthart - Team Lead, parsel.ai",
    full: `Through this letter, I wish to outline Selcuk Cihan's responsibilities during his time working on Parsel.ai and certify his excellence as senior software development engineer.

    I had the pleasure of working closely with Selcuk for almost 3 years, starting in January 2020, during which he has proven his capabilities in every single aspect of his role at our company.
    
    During his time at Parsel.ai, he has worked on various mission-critical software systems, from customer-facing graphQL APIs, to complex serverless execution orchestration on AWS, data monitoring, priority queue implementation and microservice design and implementation in general.
    
    I've been most impressed by his exceptional ability to tackle every phase of software development with in-depth knowledge, confidence and clear communication. This starts with his incredible analytical thinking and how he structures this thought process into concrete requirements, expectations, considerations and specifications. I cannot emphasize enough how good Selcuk is at communicating in a clear and structured manner. Github issues, pull-request descriptions and code documentation were always clearly outlined, with the right level of detail to convey all critical information to his peers. He has also been pivotal in tackling new features and projects where the requirements were not yet clearly defined, to guide the team from brainstorming, to feature delivery, to maintenance and monitoring.
    
    Beyond the requirements stage, Selcuk has shown again and again that he thrives in all areas of the software implementation phase. His coding style is stellar, his expertise in various programming languages, including Python, JavaScript and TypeScript, is extensive and his knowledge of testing is top-tier. Furthermore, the entire team relied on Selcuk's deep knowledge of AWS services, integrations and new feature releases.
    
    I can highly recommend Selcuk for any future ventures in his field of expertise and have no doubt that he will thrive in any company and team that values building exceptional software.`
  },
  {
    text: "“He was the perfect remote contractor in many ways. His communication skills are top, he is very much a self-starter who can get stuck in on work with minimal guidance or oversight, and his code quality (and documentation!) is exceptional.”",
    author: "Ian Watt - CTO, Tellimer",
    full: `We brought Selçuk on as a contractor almost three years ago at Tellimer. The fact that he was with us until very recently is a testament to the quality of his work product and his commitment as an engineer. He was the perfect remote contractor in many ways. His communication skills are top, he is very much a self-starter who can get stuck in on work with minimal guidance or oversight, and his code quality (and documentation!) is exceptional. After a few weeks of working with us, everyone on the team considered him an honorary core team member.

    Selçuk was the most experienced/knowledgeable AWS engineer on our team. Whenever we encountered a thorny issue or had a service that needed to be built where time-to-market and stability were paramount, Selçuk was the first engineer selected to implement it.
    
    As a company, we have been moving away from remote contractors toward full-time, local hires, but if we weren't, Selçuk would still be on the team!`
  }
]


export default function Home() {
  return (
    <main className="p-4 lg:p-8 min-h-screen">
      <div className="py-1 lg:py-8 flex justify-center items-center font-extralight lg:text-xl">
        <Link className="px-4 lg:px-8 underline" href="/">Home</Link>
        <Link className="px-4 lg:px-8" href="/career">Career</Link>
        <Link className="px-4 lg:px-8"href="/education">Education</Link>
        <Link className="px-4 lg:px-8"href="/skills">Skills</Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-16">
        <div className="p-2 lg:p-4 flex flex-row lg:flex-col items-center space-x-4 lg:space-x-0">
          <Image
            src={`/profile.png`}
            alt="Selçuk Cihan"
            width={160}
            height={160}
            className="rounded-full selc-image-container relative top-2 lg:top-0" />
          <div className="px-6 lg:px-0 text-center">
            <p className="p-1 lg:p-2 text-2xl lg:text-4xl">Selçuk Cihan</p>
            <div className="p-1 lg:p-2 lg:text-xl font-extralight">
              <p>Software Engineer</p>
            </div>
            <Email/>
            <div className="space-x-4 lg:space-x-8 p-1 lg:p-2 flex justify-center">
              <a href="https://github.com/selcukcihan" target="#blank"><GithubIcon className="h-5 w-5 lg:h-8 lg:w-8"/></a>
              <a href="https://linkedin.com/in/selcukcihan" target="#blank"><LinkedinIcon className="h-5 w-5 lg:h-8 lg:w-8"/></a>
              <a href="https://stackoverflow.com/users/4281182" target="#blank"><StackoverflowIcon className="h-5 w-5 lg:h-8 lg:w-8"/></a>
              <a href="https://twitter.com/scihan" target="#blank"><TwitterIcon className="h-5 w-5 lg:h-8 lg:w-8"/></a>
            </div>
          </div>
        </div>
        <div className="hidden lg:block p-2 lg:py-16 lg:text-xl font-extralight text-justify">
          <p>{HEADER_FIRST}</p>
          <br/>
          <p>{HEADER_SECOND}</p>
        </div>
        <div className="p-2 lg:p-4 flex flex-row lg:flex-col items-center justify-center">
          <a target="#blank" href="https://www.credly.com/badges/f2b93002-0754-4e37-8d31-031d2d520ee3">
            <Image
              src={`/architect.png`}
              alt="AWS Solutions Architect Professional Certificate"
              className="selc-image-container"
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
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial, idx) => (
            <Testimonial key={idx} {...testimonial} />
          ))}
      </div>
    </main>
  );
}

const Testimonial = (props: any) => (
  <div className="grid grid-col-1 w-72 lg:w-96 h-64 lg:h-72 m-4 p-4 justify-self-center bg-primary-0 shadow-lg rounded-sm shadow-secondary-1 text-sm lg:text-md text-justify text-pretty">
    <p className="font-extralight italic lg:pt-10">{props.text}</p>
    <p className="font-light self-end lg:pb-10">{props.author}</p>
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
