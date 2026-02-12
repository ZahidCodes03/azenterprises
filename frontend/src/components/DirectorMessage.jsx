import directorImg1 from "../assets/director.jpg";
import directorImg2 from "../assets/director2.jpg"; // <-- Add second partner image

const DirectorMessage = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto max-w-4xl px-6">

        {/* ================================= */}
        {/* Directors Images Row */}
        {/* ================================= */}
       <div className="flex justify-center gap-12 mb-14 flex-wrap">

  {/* Director 1 */}
  <div className="bg-white rounded-3xl shadow-xl p-6 w-72 text-center 
                  hover:scale-105 transition duration-300">

    <div className="w-52 h-64 mx-auto overflow-hidden rounded-2xl">
      <img
        src={directorImg1}
        alt="Director 1"
        className="w-full h-full object-cover"
      />
    </div>

    <h4 className="mt-4 text-xl font-bold text-gray-800">
      Peerzada Amir Majeed Shah
    </h4>

   
  </div>


  {/* Director 2 */}
  <div className="bg-white rounded-3xl shadow-xl p-6 w-72 text-center 
                  hover:scale-105 transition duration-300">

    <div className="w-52 h-64 mx-auto overflow-hidden rounded-2xl">
      <img
        src={directorImg2}
        alt="Director 2"
        className="w-full h-full object-cover"
      />
    </div>

    <h4 className="mt-4 text-xl font-bold text-gray-800">
      Zakir Qureshi
    </h4>

   
  </div>

</div>


        {/* ================================= */}
        {/* Message Content */}
        {/* ================================= */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Message from Our Directors
          </h2>

          <p className="text-gray-600 leading-relaxed text-lg mb-5">
            Welcome to{" "}
            <span className="font-semibold text-green-700">
              AZ Enterprises
            </span>
            , where we are committed to delivering reliable, affordable, and
            government-approved solar energy solutions for homes and businesses
            across the region.
          </p>

          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            With years of industry experience and a highly dedicated team, we
            focus on providing high-quality installations, long-term service
            support, and complete guidance to help our customers benefit from
            the{" "}
            <span className="font-semibold">
              PM Surya Ghar Muft Bijli Yojana Scheme
            </span>
            .
          </p>

          <p className="text-gray-700 font-medium italic text-lg mb-8">
            "Our mission is to power a sustainable future through clean energy
            and customer-first service."
          </p>

          {/* Signature Line */}
          <h4 className="text-xl font-semibold text-green-700">
            — Directors, AZ Enterprises 🌞
          </h4>

          <p className="text-sm text-gray-500 mt-2">
            Empowering Kashmir with Solar Energy
          </p>
        </div>
      </div>
    </section>
  );
};

export default DirectorMessage;
