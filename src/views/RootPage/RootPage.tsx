import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RootPage = () => {
  return (
    /* header here */
    <div>
      <nav className="bg-slate-200">
        <ul className="flex mx-1 py-5 justify-around">
          <li>
            <Button>
              <Link to="/patients">Список пациентов</Link>
            </Button>
          </li>
          <li>
            <Button>
              <Link to="/contacts">Мои контакты</Link>
            </Button>
          </li>
        </ul>
      </nav>
      
      <Outlet />
    </div>
  );
};

export default RootPage;
