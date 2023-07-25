import client from "@sanity/client";

export const sanityClient = client({
  projectId: "5wmwst53",
  dataset: process.env.NODE_ENV || "development",
  useCdn: false, // set this to true if you want to use the cached API response
  token:
    "skiBX1PziWFp5juPLh8PHv0Apin7QlNpfiSzpinmS7yyWbV8QJBk2K6NMV8kkOSAZFKOa4SfC0Xpj7R5ztqsF5dhqZdhwn6uS4cUY07rsc11MTxrrX2sFbaiIE6x6tIwme3oqhGg5keqPtMUbrSJf7eJB3x7Xv0O5K8k852dhFTL2lFArF6C",
});
