import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { Logo } from "./logo"
import { PagesQuery } from "@/queries/page/Pages";
import { print } from 'graphql';
import { Page, RootQuery } from "@/gql/graphql";
import Link from "next/link";



  export default async function Footer() {

      const { pages } = await fetchGraphQL<{ pages: { edges: { node: Page }[] } }>(print(PagesQuery), {});
    
      const pageLinks = pages?.edges.map(edge => edge.node)
        

    return (
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="sm:grid sm:grid-cols-2 xl:gap-8">
            <div className="space-y-8">
           <Logo/>
            </div>
            <div className=" grid grid-cols-1 gap-8 xl:mt-0">
              <div className="mt-10 sm:mt-0 sm:grid sm:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm/6 font-semibold text-gray-900">Informacija</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {pageLinks.map((page) => (
                      <li key={page.title}>
                        <Link href={`/${page.slug}`} className="text-sm/6 text-gray-600 hover:text-gray-900">
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-sm/6 text-gray-600">&copy; 2024 Moxon, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
  