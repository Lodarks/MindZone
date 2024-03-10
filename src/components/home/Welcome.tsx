import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

const Welcome = () => {
  return (
    <section
      className="bg-white dark:bg-zinc-900 p-4 shadow-md rounded-md w-full"
    >
      {/* TODO: yazilar degisebilir cok uzun ve okumak sıkıcı gelebilir */}
      <h2 className="font-semibold text-4xl flex justify-center">
        MindZone&apos;a Hoşgeldiniz.
      </h2>
      <div>
        Sizler için ruh sağlığına yönelik hazırladığımız{" "}
        <span className="font-bold">online ve ücretsiz</span> egzersiz
        programımıza hoş geldiniz.
        <br />
        Amacımız kaygı, stres ve depresyon gibi ruh sağlığı problemlerine hızlı
        ve eğlenceli çözüm yolları üretmektedir. Bu amaç doğrultusunda sizlerden
        birkaç hafta tasarladığımız egzersizleri deneyimlemeniz beklenmektedir.
        <br />
        Egzersizleri tamamladığınız da{" "}
        <div className="font-bold">
          <InfiniteMovingCards
            speed="faster"
            pauseOnHover={false}
            items={[
              {
                name: "",
                quote: "200TL",
                title: "Hediye Çeki",
              },
              {
                name: "",
                quote: "300TL",
                title: "Hediye Çeki",
              },
              {
                name: "",
                quote: "400TL",
                title: "Hediye Çeki",
              },
              {
                name: "",
                quote: "500TL",
                title: "Hediye Çeki",
              },
            ]}
          />
        </div>{" "}
        çekleri kazanma fırsatınız olacaktır. Bu çekleri istediğiniz şekilde
        kullanmanız için sizlere ulaştırılacaktır.
        <br />
        Uygulamalar 6 hafta sürmesi beklenirken her egzersiz 10-15 dakikalık
        çalışmalardan oluşmaktadır ve dilediğiniz saat ve günde haftalık
        egzersizleri deneyimleyeme hakkına sahip olacaksınız.
        <br />
        Bizlerle ilgili bilgilere ulaşmak ve iletişime geçmek için
        &quot;Hakkımızda&quot; kısmına tıklayabilirsiniz.
      </div>
    </section>
  );
};

export default Welcome;
