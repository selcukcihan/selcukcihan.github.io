import Header from "../../components/header"
import { ContentStyle, MainStyle } from "../common"

const LIST_STYLE = 'list-square mx-12'

const data = [
  {
    company: 'RTIC Outdoors',
    website: {
      name: 'rticoutdoors.com',
      url: 'https://rticoutdoors.com'
    },
    role: 'Contractor',
    year: '2023 - Present',
    content: <ul className={LIST_STYLE}>
      <li>Created mobile device management tools.</li>
      <li>Documented procedures and warehouse business flows.</li>
      <li>Automated warehouse operations.</li>
      <li>Increased observability of the backend systems.</li>
    </ul>,
    tech: [
      "Scala",
      "Spring",
      "Kubernetes",
      "Postgres",
      "Google Cloud",
      "DataDog",
    ],
  },
  {
    company: 'Serverless Inc',
    website: {
      name: 'serverless.com',
      url: 'https://www.serverless.com'
    },
    role: 'Contractor',
    year: '2023',
    content: <ul className={LIST_STYLE}>
      <li>Created the Python AWS Lambda SDK for Serverless Console, which is an observability platform for applications running on AWS Lambda.</li>
      <li>Implemented CI/CD flows on github actions.</li>
      <li>Automated tests that validate end to end business logic and performance.</li>
    </ul>,
    tech: [
      "Python",
      "Serverless",
      "Lambda",
      "AWS",
    ]
  },
  {
    company: 'Scriber',
    website: {
      name: 'scriber.to',
      url: 'https://scriber.to'
    },
    role: 'Contractor',
    year: '2021 - 2022',
    content: <ul className={LIST_STYLE}>
      <li>Created the serverless GraphQL backend for scriber.to, which is a platform for financial writers.</li>
      <li>Implemented payments with Stripe Connect.</li>
      <li>Built analytics application to provide the financial writers with KPIs.</li>
    </ul>,
    tech: [
      "Typescript",
      "Serverless",
      "Lambda",
      "AppSync",
      "DynamoDB",
      "RDS",
      "Stripe",
      "EventBridge",
    ]
  },
  {
    company: 'Tellimer',
    website: {
      name: 'tellimer.com',
      url: 'https://tellimer.com'
    },
    role: 'Contractor',
    year: '2019 - 2021',
    content: <ul className={LIST_STYLE}>
      <li>Created the API and step functions orchestrator that forms the machine learning pipeline for parsel.ai, which is a machine learning SAAS offering.</li>
      <li>Implemented serverless workflows for ingesting 3rd party financial articles for tellimer.com.</li>
      <li>Architected an article recommender and an article summarizer for tellimer.com.</li>
      <li>Integrated with Stripe for SAAS subscriptions.</li>
      <li>Built a serverless app that periodically maintains the sitemap for various web apps.</li>
      <li>Created GraphQL APIs with AppSync, connecting various data sources like DynamoDB & RDS.</li>
      <li>Created serverless workflows using AWS Step Functions to integrate with external services.</li>
    </ul>,
    tech: "TypeScript, Python, Serverless, Lambda, API Gateway, DynamoDB, Stripe, EventBridge, AppSync, Cognito, Datadog".split(', ')
  },
  {
    company: 'Toptal',
    website: {
      name: 'toptal.com',
      url: 'https://toptal.com'
    },
    role: 'Freelancer',
    year: '2018 - 2019',
    content: <ul className={LIST_STYLE}>
      <li>Worked as the lead backend developer for a non-profit client.</li>
      <li>Developed a REST API, fully serverless on AWS.</li>
      <li>Optimized cost resulting in more than 50% saving on AWS bill.</li>
      <li>Improved performance by reengineering caching on CloudFront/S3.</li>
      <li>Mentored developers and reviewed pull requests.</li>
    </ul>,
    tech: "Python, Serverless, Lambda, API Gateway, DynamoDB, VPC, SQS, CloudWatch, S3, CloudFront".split(', ')
  },
  {
    company: 'Amazon',
    website: {
      name: 'amazon.com',
      url: 'https://amazon.com'
    },
    role: 'Software Development Engineer',
    year: '2017 - 2018',
    content: <ul className={LIST_STYLE}>
      <li>Developed and maintained the orchestration platform that processes Amazon’s catalog updates. The platform is able to handle tens of thousands of TPS, enabling the finest and largest catalog on earth. Uses Kinesis as the backbone and routes updates to the catalog to relevant downstream services.</li>
      <li>Added further functionality to a Node.js service which is a high TPS REST service for diff analysis.</li>
      <li>Refactored an orchestration engine which consumes Kinesis and calls downstream services such that the application can be started without any dependencies, thus enabling performance testing of the core.</li>
      <li>Supported the reconciliation engine (Java 8) that generates the retail catalog.</li>
      <li>Carried out live migrations of several web services without downtime. Successfully deprecated multiple legacy services in an effort to simplify the overall architecture and enable catalog growth.</li>      
    </ul>,
    tech: "Python, Serverless, Lambda, API Gateway, DynamoDB, VPC, SQS, CloudWatch, S3, CloudFront".split(', ')
  },
  {
    company: 'Intertech',
    website: {
      name: 'intertech.com.tr',
      url: 'https://www.intertech.com.tr'
    },
    role: 'Senior Software Engineer',
    year: '2013 - 2017',
    content: <ul className={LIST_STYLE}>
      <li>Supported the workflow engine (C#, Windows service) serving banking applications such as loans, customer complaints etc.</li>
      <li>Set up elastic to index workflow engine documents, enabling powerful search mechanisms for the end user.</li>
      <li>Designed and implemented a workforce management system that empowers the bank’s operation center. The application uses Microsoft’s solver foundation to solve the task assignment problem. This project got <a title="BAI 2017 Internal Process Innovation Award" href="https://www.bai.org/globalinnovations/awards/past-winners/winners-2017/2017-internal-process-innovation-award"></a>BAI global innovation award.</li>
    </ul>,
    tech: "Microsoft .Net, C#, MSSQL, ElasticSearch, REST, Agile, Unit testing, JavaScript, DevOps".split(', ')
  },
  {
    company: 'Ziraat Teknoloji',
    website: {
      name: 'ziraatteknoloji.com',
      url: 'https://www.ziraatteknoloji.com'
    },
    role: 'Software Development Engineer',
    year: '2011 - 2013',
    content: <ul className={LIST_STYLE}>
      <li>Designed and implemented workflow engine running on top of Oracle, serving over 100,000 workflow instances daily.</li>
      <li>Served as scrum master and mentored junior developers.</li>
    </ul>,
    tech: "Microsoft .NET, C#, WinForms, WPF, Oracle".split(', ')
  },
]

export default function Career(props: any) {
  return (
    <main className={MainStyle}>
      <Header selected="career"/>
      <div className={ContentStyle}>
        <div className="grid grid-cols-1 gap-8 py-8">
          {data.map((job, idx) => (<JobCard key={idx} {...job}/>))}
        </div>
      </div>
    </main>
  )
}

const JobCard = (props: any) => (
  <div className="flex flex-col place-self-center w-full lg:w-1/2 bg-primary-0 dark:bg-secondary-1 dark:shadow-black shadow-sm rounded-sm shadow-secondary-1">
    <div className="p-8 grid grid-cols-2">
      <div>
        <p className="font-medium text-lg">{props.company}</p>
        <p className="font-light italic">
          <a href={props.website.url} target="_blank">
            {props.website.name}
          </a>
        </p>
        <p className="font-normal">{props.role}</p>
      </div>
      <p className="p-8 justify-self-end font-extralight text-sm content-center">{props.year}</p>
    </div>
    <div className="text-sm lg:text-base">
      {props.content}
    </div>
    <div className="flex flex-row flex-wrap gap-1 px-8 flex-grow items-end p-8">
      {props.tech.map((tech: string, idx: number) => (
        <span key={idx} className="bg-secondary-2 dark:bg-secondary-3 rounded p-1 text-xs dark:font-light">{tech}</span>
      ))}
    </div>
  </div>
)
