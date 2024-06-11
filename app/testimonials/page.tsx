import Header from "../../components/header"
import { MainStyle } from "../common"
import { TESTIMONIALS } from "../data"


export default function Testimonials(props: any) {
  return (
    <main className={MainStyle}>
      <Header selected="testimonials"/>
      <div className="px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-8 pt-8">
          {TESTIMONIALS.map((testimonial, idx) => (<TestimonialCard key={idx} {...testimonial}/>))}
        </div>
      </div>
    </main>
  )
}

const TestimonialCard = (props: any) => (
  <div id={props.link.split('#')[1]} className="flex flex-col place-self-center w-full lg:w-1/2 bg-primary-0 dark:bg-secondary-1 dark:shadow-black shadow-sm rounded-sm shadow-secondary-1">
    <p className="font-medium text-xl p-4">
      {props.author}
    </p>
    <div className="text-sm lg:text-base items-end p-8">
      {props.full}
    </div>
  </div>
)
