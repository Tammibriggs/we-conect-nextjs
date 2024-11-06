import { Person } from "@mui/icons-material";
import { useEffect, useState } from "react";
import style from "../styles/searchPerson.module.css";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useLazySearchPeopleQuery } from "@/redux/services/user";
import { MagnifyingGlass } from "@phosphor-icons/react";

function SearchPeople({
  setSearchModalOpen,
  customResultsStyle,
  customContainer,
}: SearchPeople) {
  const router = useRouter();
  const { data: userData } = useSession() as ClientSession;

  const [query, setQuery] = useState("");

  const [searchPeople, results] = useLazySearchPeopleQuery();

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPeople(query);
    }, 1000);

    return () => clearTimeout(timer);
  }, [query]);

  const viewProfile = (user: User) => {
    router.push(`/profile/?id=${user._id}`);
    setSearchModalOpen(false);
  };

  return (
    <div className={`${style.searchPeople} ${customContainer}`}>
      <div className={`noButtonSearch ${style.noButtonSearchMod}`}>
        <MagnifyingGlass size={20} />
        <input
          placeholder="Search for people"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {!!results.data?.length && (
        <div className={`${style.search__results} ${customResultsStyle}`}>
          {results.data.map((user) => (
            <div
              className={style.search__resultsPerson}
              key={user._id}
              onClick={() => viewProfile(user)}
            >
              <img
                src={
                  user.profilePicture?.url
                    ? user.profilePicture?.url
                    : "/assets/noProfile.jpg"
                }
                alt="profile"
              />
              <div>
                <span>{user.username}</span>
                {user.followers.includes(userData.user._id) ||
                user.followings.includes(userData.user._id) ? (
                  <div>
                    <Person />
                    {!(
                      user.followers.includes(userData.user._id) &&
                      user.followings.includes(userData.user._id)
                    ) ? (
                      <span className={style.search__resultsPersonDesc}>
                        {user.followers.includes(userData.user._id)
                          ? "Following"
                          : "Follows you"}
                      </span>
                    ) : (
                      <span className={style.search__resultsPersonDesc}>
                        You are following each other
                      </span>
                    )}
                  </div>
                ) : (
                  <span className={style.search__resultsPersonDesc}>
                    {user.bio}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPeople;
