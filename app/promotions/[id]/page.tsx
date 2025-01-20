import BreadCrumbs from "@/components/properties/BreadCrumbs";
import Description from "@/components/properties/Description";
import ImageContainer from "@/components/properties/ImageContainer";
import ShareButton from "@/components/properties/ShareButton";
import { fetchPromotionDetailsPublic } from "@/utils/actions";
import { redirect } from "next/navigation";

async function PromotionDetailPage({ params }: { params: { id: string } }) {
  try {
    const promotion = await fetchPromotionDetailsPublic(params.id);
    if (!promotion) redirect("/");

    return (
      <section>
        <BreadCrumbs name={promotion.title} />
        <header className="flex justify-between items-center mt-4">
          <h1 className="text-4xl font-bold capitalize">{promotion.subtitle}</h1>
          <div className="flex items-center gap-x-4">
            <ShareButton name={promotion.title} propertyId={promotion.id} />
          </div>
        </header>
        <ImageContainer mainImage={promotion.media} name={promotion.title} />

        <section className="lg:grid lg:grid-cols-12 gap-x-12 mt-12">
          <div className="lg:col-span-8">
            <div className="flex gap-x-4 items-center">
              <h1 className="text-xl font-bold">{promotion.title}</h1>
            </div>
            <Description description={promotion.description} />
          </div>
        </section>
      </section>
    );
  } catch (error) {
    redirect("/");
  }
}

export default PromotionDetailPage;
