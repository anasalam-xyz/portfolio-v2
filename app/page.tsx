import { HomeSections } from "@/components/HomeSections";
import { getGitHubActivity } from "@/lib/github";
import { getLeetCodeActivity } from "@/lib/leetcode";

export default async function Home() {
  const [githubData, leetcodeData] = await Promise.all([
    getGitHubActivity(),
    getLeetCodeActivity(),
  ]);

  return <HomeSections githubData={githubData} leetcodeData={leetcodeData} />;
}
