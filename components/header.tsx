import Link from 'next/link'

export default function Header(props: any) {
  const className = (field: string) => `hover:underline decoration-4 decoration-gray-500 underline-offset-4 px-4 lg:px-8 ${props.selected === field ? ' underline font-extralight' : ''}`
  return (
    <div {...props} className="py-1 lg:py-8 flex justify-center items-center font-thin lg:text-xl">
      <Link className={className('home')} href="/">Home</Link>
      <Link className={className('career')} href="/career">Career</Link>
      <Link className={className('education')} href="/education">Education</Link>
    </div>
  )
}
