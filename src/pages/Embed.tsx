import { useParams } from "react-router-dom";

const Embed = () => {
  const { embedId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Eingebetteter Player {embedId}
      </h1>
      {/* Eingebetteter Player wird hier implementiert */}
    </div>
  );
};

export default Embed;