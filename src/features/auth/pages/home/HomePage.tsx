import { LoginForm } from "../../components/LoginForm";
import { WelcomeCard } from "../../components/WelcomeCard";
export const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2">
        <LoginForm />
      </div>
      <div className="w-full md:w-1/2">
        <WelcomeCard />
      </div>
    </div>
  );
};
