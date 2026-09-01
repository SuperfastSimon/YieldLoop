import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { ArticleBody } from "@/components/yieldloop/article";
import { isLive } from "@/lib/yieldloop/compliance";
import {
  EMPTY_PARTNER,
  mergePartner,
  partnerFromQuery,
  partnerReady,
  rewriteBodyForPublic,
  retagBody,
} from "@/lib/yieldloop/links.ts";
import { useYieldStore } from "@/lib/yieldloop/store";

export const Route = createFileRoute("/p/$slug")({ component: PublicArticle });

function PublicArticle() {
  const { slug } = Route.useParams();
  const hydrated = useYieldStore((s) => s.hydrated);
  const artefacts = useYieldStore((s) => s.artefacts);
  const publishes = useYieldStore((s) => s.publishes);
  const programs = useYieldStore((s) => s.programs);
  const partner = useYieldStore((s) => s.partner) ?? EMPTY_PARTNER;
  const searchStr = useRouterState({ select: (s) => s.location.searchStr ?? "" });

  if (!hydrated) {
    return <p className="px-5 py-16 text-sm text-muted">Artikel laden…</p>;
  }

  const art = artefacts.find((a) => a.slug === slug);
  const live = art ? isLive(art, publishes) : false;
  const merged = mergePartner(partner, partnerFromQuery(searchStr));
  const tagged = art ? retagBody(art.body, programs, merged) : "";
  const publicBody = art ? rewriteBodyForPublic(tagged, programs) : "";

  if (!art || !live) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <h1 className="text-2xl font-medium tracking-tight">Artikel is niet live</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          YieldLoop toont geen publieke pagina zonder actieve PublishRecord. Geen phantom live.
        </p>
        <Link to="/" className="mt-6 inline-block text-sm text-accent hover:underline">
          Naar commando
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-xs font-medium tracking-wide text-accent">Publiek artikel</p>
      <p className="mt-2 text-xs text-muted">
        {art.language} · peildatum {art.priceAsOf?.slice(0, 10) ?? "—"}
        {partnerReady(merged) ? " · getagd" : " · nog niet getagd — operator moet Verdienen invullen"}
      </p>
      <div className="mt-8">
        <ArticleBody body={publicBody} />
      </div>
    </article>
  );
}
