'use client';
import Document from "@/components/ui/Document";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento"
import { cn } from "@/utils/cn";
import {
  IconArrowWaveRightUp,
  IconBrandGithub,
  IconFile3d
} from "@tabler/icons-react";
import { Loader } from "@/components/ui/loader/Loader";
import {useEffect, useLayoutEffect, useState } from "react";
import { Skills } from "@/components/ui/skills/Skills";

export default function Home() {
  const [documentLoaded, setDocumentLoaded] = useState(false);
  
  useLayoutEffect(() => {
    // This code will run synchronously after all DOM mutations
    setDocumentLoaded(true);
  }, []);

  // State to determine if the device is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = [
    {
      title: "Tushar Puri",
      description: "My interest is in building beautiful websites, tools and applications. I'm a full stack developer with a passion for learning and sharing my knowledge with others.",
      header: <img src="/mountain.jpg" className="rounded-lg "/>
    },
    {
      title: "Continous learning",
      description: "Here are the tools & frameworks I'm familiar with and I'm actively seeking new opportunities to broaden my skill set.",
      header: <Skills/>,
      icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Portfolio",
      description: "You can find my projects here.",
      header: <div className="pt-4">{!documentLoaded && !isMobile && <Loader/>}
      <div className="lg:hidden block flex justify-center  bg-gradient-to-br from-yellow-400 via-green-500 to-purple-600 animate-glow rounded-xl py-20"></div>
      </div>,
    },
    {
      title: "Trying to maintain consistency in this chaotic world!",
      header: <img src="https://github-readme-activity-graph.vercel.app/graph?username=tusharpuri10&theme=github-compact"/>,
      icon: <IconBrandGithub className="h-5 w-5 text-white"/>
    },
    {
      title: "Coding Languages I know",
      description: "I like typescript and python. I enjoy building websites and tolerate solving bugs.",
      header: <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=tusharpuri10&layout=compact&show_icons=true&title_color=ffffff&icon_color=34abeb&text_color=daf7dc&bg_color=151515"/>,
      icon: <IconBrandGithub className="h-5 w-5 text-white"/>
    },
    
  ];

  return (
    <div>
      <div>{documentLoaded && <Document />}</div>
      <BentoGrid className="max-w-4xl py-12 px-8 lg:py-4 mx-auto">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </div>
  );
}