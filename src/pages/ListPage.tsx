import { useCallback, useEffect } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import Contact from "../components/Contact";
import ErrorWindow from "../components/ErrorWindow";
import Loader from "../components/Loader";
import { CustomError, IContact } from "../models/models";
import {
  useGetContactsQuery,
  useLogoutMutation,
} from "../store/api/contacts.api";

const ListPage: React.FC = () => {
  const { user } = useParams();
  const [logout, { data: logoutData, isLoading: isLogoutLoading }] =
    useLogoutMutation();
  const { data, isError, error, isLoading } = useGetContactsQuery();
  const navigate: NavigateFunction = useNavigate();

  const get_cookie = useCallback((name: string) => {
    return document.cookie.split(";").some((c) => {
      return c.trim().startsWith(name + "=");
    });
  }, []);

  const delete_cookie = useCallback(
    (name: string, path: string, domain: string) => {
      if (get_cookie(name)) {
        document.cookie =
          name +
          "=" +
          (path ? ";path=" + path : "") +
          (domain ? ";domain=" + domain : "") +
          ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
      }
      return;
    },
    [get_cookie]
  );

  const handleLogout: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();
    await logout();
  };

  useEffect(() => {
    if (logoutData) {
      delete_cookie("token", "/", "localhost");
      navigate("/contacts");
    }
  }, [delete_cookie, logoutData, navigate]);

  useEffect(() => {
    if (isError && (error as CustomError).status === 403) {
      console.log("this");
      navigate("/contacts");
    }
  }, [error, isError, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mx-auto h-screen">
        <Loader border={true} />
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center p-[20px]">
      <article className="box w-fit mr-[0px] self-end grid grid-flow-col gap-[20px] items-center font-bold text-xl">
        <span className="text-yellow-400 italic">{user}</span>
        <button
          className="button bg-fuchsia-600"
          type="submit"
          onClick={handleLogout}
        >
          {isLogoutLoading ? <Loader border={false} /> : "Выйти"}
        </button>
      </article>
      <main className="flex justify-center items-center mx-auto h-screen">
        {isError && (error as CustomError).status !== 403 && <ErrorWindow />}
        {data && (
          <div className="box">
            <table className="table-fixed border-collapse">
              <caption className="text-3xl text-fuchsia-600">Контакты</caption>
              <thead>
                <tr className="text-yellow-400 italic bg-gray-900">
                  <th className="w-1/5 table-cell">Имя</th>
                  <th className="w-1/5 table-cell">Фамилия</th>
                  <th className="w-1/5 table-cell">Город</th>
                  <th className="w-3/5 table-cell">Телефон</th>
                </tr>
              </thead>
              <tbody>
                {data.map((contact: IContact) => (
                  <Contact key={contact.id} data={contact} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
export default ListPage;
