import directorImg from "../assets/director.jpg";

const DirectorMessage = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* Director Image */}
        <div className="flex justify-center">
         <img
  src={directorImg}
  alt="Director"
  className="w-72 md:w-80 lg:w-96 h-auto rounded-2xl shadow-lg"
/>
        </div>

        {/* Message Content */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Director’s Message
          </h2>

          <p className="text-gray-600 leading-relaxed mb-4">
            Welcome to <span className="font-semibold">AZ Enterprises,</span>
            where we are committed to delivering reliable, affordable, and government-approved solar energy solutions for homes and businesses across the region.

Our mission is to power a sustainable future through clean energy and customer-first service.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            With years of industry experience and a highly dedicated team, we focus on providing high-quality installations, long-term service support, and complete guidance to help our customers benefit from the PM Surya Ghar Muft Bijli Yojna Scheme.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">Our mission is to power a sustainable future through clean energy and customer-first service.</p>

          <h5 className="text-xl font-semibold text-blue-600 mb-2">
            Peerzada Amir Majeed Shah
            </h5>

          <h4 className="text-xl font-semibold text-green-700">
            — Director, AZ Enterprises
          </h4>
        </div>
      </div>
    </section>
  );
};

export default DirectorMessage;
