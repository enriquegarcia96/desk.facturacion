import { Typography } from "antd";
const { Title, Text } = Typography;

import shopLogo from "../../../assets/i-like-food.svg";

export const WelcomeCard = () => {
  return (
    <div
      className="relative min-h-screen bg-repeat bg-auto bg-zinc-800"
      style={{ backgroundImage: `url(${shopLogo})` }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-5xl leading-tight font-semibold">
        <Title style={{ color: "white" }}>
          Bienvenido al sistema de inventarios y facturación
        </Title>
        <Text style={{ color: "white" }}>
          Gestiona tus productos, ventas y facturación desde un solo lugar
        </Text>
      </div>
    </div>
  );
};
