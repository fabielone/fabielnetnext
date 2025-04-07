import { ChildProcess } from "child_process";
import React from "react";

export interface BlogPostMetadata {
    title: string;
    publishedAt: string;
    summary?: string;
    // Add any other frontmatter fields you use
    // e.g., tags: string[];
    //       image?: string;
  }
  
  export interface BlogPost {
    locale: string;
    slug: string;
    metadata: BlogPostMetadata;
    content?: string; // Optional if you need the full content
  }