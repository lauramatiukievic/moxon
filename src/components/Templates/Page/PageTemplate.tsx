import { print } from "graphql/language/printer";
import { ContentNode, Page } from "@/gql/graphql";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { PageQuery } from "./PageQuery";

interface TemplateProps {
  node: ContentNode;
}

export default async function PageTemplate({ node }: TemplateProps) {
  const { page } = await fetchGraphQL<{ page: Page }>(print(PageQuery), {
    id: node.databaseId,
  });

  return (
  <div className="bg-white"><div className="mx-auto max-w-7xl pt-8 px-4 sm:px-6 lg:px-8" dangerouslySetInnerHTML={{ __html: page?.content || "" }} /> </div>)
  ;
}
