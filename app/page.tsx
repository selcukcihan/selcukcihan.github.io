import Image from "next/image";
import Link from 'next/link'
import { SocialIcon } from 'react-social-icons'

export default function Home() {
  return (
    <main className="p-4 lg:p-8 min-h-screen">
      <div className="py-1 lg:py-8 flex justify-center items-center">
        <Link className="px-4 lg:px-8 underline" href="/">Home</Link>
        <Link className="px-4 lg:px-8" href="/career">Career</Link>
        <Link className="px-4 lg:px-8"href="/education">Education</Link>
        <Link className="px-4 lg:px-8"href="/skills">Skills</Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="p-2 lg:p-4 flex flex-row lg:flex-col items-center space-x-4 lg:space-x-0">
          <Image
            src={`/profile.png`}
            alt="Selçuk Cihan"
            width={160}
            height={160}
            className="rounded-full selc-image-container relative top-2 lg:top-0" />
          <div className="px-6 lg:px-0">
            <p className="p-1 lg:p-2 text-2xl lg:text-4xl">Selçuk Cihan</p>
            <div className="p-1 lg:p-2 lg:text-2xl italic font-extralight">
              <p>Software Engineer</p>
              <p>Freelancer</p>
            </div>
            <p className="p-1 lg:p-2 text-sm lg:text-xl font-extralight">selcukcihan@gmail.com</p>
            <div className="space-x-1 p-1 lg:p-2 flex justify-center">
              <span className="selc-icon-container"><SocialIcon url="https://github.com/selcukcihan" /></span>
              <span className="selc-icon-container"><SocialIcon url="https://linkedin.com/in/selcukcihan" /></span>
              <span className="selc-icon-container"><SocialIcon url="https://stackoverflow.com/users/4281182" /></span>
              <span className="selc-icon-container hidden lg:inline"><SocialIcon url="https://twitter.com/scihan" /></span>
            </div>
          </div>
        </div>
        <div className="hidden lg:block p-2 lg:py-16 lg:text-2xl font-extralight text-justify">
          <p>As a former Amazonian devoted to helping customers and solving problems, Selçuk brings a strong sense of ownership and a track record of delivering results.</p>
          <br/>
          <p>With over seven years of experience developing applications on AWS, he has a proven ability to take on technical duties from operations to development and architecture.</p>
        </div>
        <div className="p-2 lg:p-4 flex flex-row lg:flex-col items-center justify-center">
          <Image
            src={`/architect.png`}
            alt="AWS Solutions Architect Professional Certificate"
            className="selc-image-container"
            width={160}
            height={160} />
          <Image
            src={`/developer.png`}
            alt="AWS Developer Associate Certificate"
            className="selc-image-container m-2 lg:m-8"
            width={160}
            height={160} />
        </div>
      </div>
    </main>
  );
}

const testimonial = (text: string) => (
  <div className="p-2 lg:p-4 lg:text-2xl font-extralight text-justify ">
    <p>{text}</p>
  </div>
)
