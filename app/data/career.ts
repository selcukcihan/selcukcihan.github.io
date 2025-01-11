import { CareerExperience } from '../types/data'


export const careerExperiences: CareerExperience[] = [
  {
    company: 'RTIC Outdoors',
    website: {
      name: 'rticoutdoors.com',
      url: 'https://rticoutdoors.com'
    },
    role: 'Contractor',
    period: '2023 - Present',
    description: "",
    achievements: [
      "Created mobile device management tools.",
      "Documented procedures and warehouse business flows.",
      "Automated warehouse operations.",
      "Increased observability of the backend systems.",
    ],
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
    period: '2023',
    description: "",
    achievements: [
      "Created the Python AWS Lambda SDK for Serverless Console, which is an observability platform for applications running on AWS Lambda.",
      "Implemented CI/CD flows on github actions.",
      "Automated tests that validate end to end business logic and performance.",
    ],
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
    period: '2021 - 2022',
    description: "",
    achievements: [
      "Created the serverless GraphQL backend for scriber.to, which is a platform for financial writers.",
      "Implemented payments with Stripe Connect.",
      "Built analytics application to provide the financial writers with KPIs.",
    ],
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
    period: '2019 - 2021',
    description: "",
    achievements: [
      "Created the API and step functions orchestrator that forms the machine learning pipeline for parsel.ai, which is a machine learning SAAS offering.",
      "Implemented serverless workflows for ingesting 3rd party financial articles for tellimer.com.",
      "Architected an article recommender and an article summarizer for tellimer.com.",
      "Integrated with Stripe for SAAS subscriptions.",
      "Built a serverless app that periodically maintains the sitemap for various web apps.",
      "Created GraphQL APIs with AppSync, connecting various data sources like DynamoDB & RDS.",
      "Created serverless workflows using AWS Step Functions to integrate with external services.",
    ],
    tech: "TypeScript, Python, Serverless, Lambda, API Gateway, DynamoDB, Stripe, EventBridge, AppSync, Cognito, Datadog".split(', ')
  },
  {
    company: 'Toptal',
    website: {
      name: 'toptal.com',
      url: 'https://toptal.com'
    },
    role: 'Freelancer',
    period: '2018 - 2019',
    description: "",
    achievements: [
      "Worked as the lead backend developer for a non-profit client.",
      "Developed a REST API, fully serverless on AWS.",
      "Optimized cost resulting in more than 50% saving on AWS bill.",
      "Improved performance by reengineering caching on CloudFront/S3.",
      "Mentored developers and reviewed pull requests.",
    ],
    tech: "Python, Serverless, Lambda, API Gateway, DynamoDB, VPC, SQS, CloudWatch, S3, CloudFront".split(', ')
  },
  {
    company: 'Amazon',
    website: {
      name: 'amazon.com',
      url: 'https://amazon.com'
    },
    role: 'Software Development Engineer',
    period: '2017 - 2018',
    description: "",
    achievements: [
      "Developed and maintained the orchestration platform that processes Amazon’s catalog updates. The platform is able to handle tens of thousands of TPS, enabling the finest and largest catalog on earth. Uses Kinesis as the backbone and routes updates to the catalog to relevant downstream services.",
      "Added further functionality to a Node.js service which is a high TPS REST service for diff analysis.",
      "Refactored an orchestration engine which consumes Kinesis and calls downstream services such that the application can be started without any dependencies, thus enabling performance testing of the core.",
      "Supported the reconciliation engine (Java 8) that generates the retail catalog.",
      "Carried out live migrations of several web services without downtime. Successfully deprecated multiple legacy services in an effort to simplify the overall architecture and enable catalog growth.",
    ],
    tech: "Python, Serverless, Lambda, API Gateway, DynamoDB, VPC, SQS, CloudWatch, S3, CloudFront".split(', ')
  },
  {
    company: 'Intertech',
    website: {
      name: 'intertech.com.tr',
      url: 'https://www.intertech.com.tr'
    },
    role: 'Senior Software Engineer',
    period: '2013 - 2017',
    description: "",
    achievements: [
      "Supported the workflow engine (C#, Windows service) serving banking applications such as loans, customer complaints etc.",
      "Set up elastic to index workflow engine documents, enabling powerful search mechanisms for the end user.",
      "Designed and implemented a workforce management system that empowers the bank’s operation center. The application uses Microsoft’s solver foundation to solve the task assignment problem. This project got BAI Internal Process Innovation Award at 2017.",
    ],
    tech: "Microsoft .Net, C#, MSSQL, ElasticSearch, REST, Agile, Unit testing, JavaScript, DevOps".split(', ')
  },
  {
    company: 'Ziraat Teknoloji',
    website: {
      name: 'ziraatteknoloji.com',
      url: 'https://www.ziraatteknoloji.com'
    },
    role: 'Software Development Engineer',
    period: '2011 - 2013',
    description: "",
    achievements: [
      "Designed and implemented workflow engine running on top of Oracle, serving over 100,000 workflow instances daily.",
      "Served as scrum master and mentored junior developers.",
    ],
    tech: "Microsoft .NET, C#, WinForms, WPF, Oracle".split(', ')
  },
  {
    company: 'AirTies',
    website: {
      name: 'airties.com',
      url: 'https://airties.com'
    },
    role: 'Software Development Engineer',
    period: '2009 - 2010',
    description: "",
    achievements: [
      "Developed solutions for IPTV products in C & C++",
      "Implemented teletext and rtsp parsers.",
      "Worked on closed captioning and subtitles for IPTV.",
    ],
    tech: "C, C++, busybox, unix, kernel, rtsp, teletext, iptv".split(', ')
  },
]
