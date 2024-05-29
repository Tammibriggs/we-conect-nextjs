import { Person, Search } from "@mui/icons-material";
import { useRef, useState } from "react";
import axios from "axios";
import style from "../styles/searchPerson.module.css";
import { useRouter } from "next/router";

export default function SearchPeople({
  userData,
  setSearchModalOpen = () => {},
  customResultsStyle,
  customContainer,
}) {
  const router = useRouter();
  const [searchResult, setSearchResult] = useState([]);
  const controller = useRef(null);

  // useEffect(() => {
  //   if (currentController) {
  //     setOldController(currentController);
  //   }
  // }, [currentController]);

  const viewProfile = (user) => {
    router.push(`/profile/?id=${user._id}`);
    setSearchResult([]);
    setSearchModalOpen(false);
  };

  // abort old request if it exist and search for users using the enter value in the input field
  const handleSearch = async (e) => {
    // if (controller.current) {
    //   console.log("reached", controller.current);
    //   controller.current.abort();
    // }
    controller.current = new AbortController();
    // Cancel the previous request if a controller exists
    if (e.target.value.length !== 0) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_SEVER_BASE_URL}/users/search?search=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
            signal: controller.current.signal,
          }
        )
        .then((res) => {
          setSearchResult(res.data.data);
        });
    } else {
      setSearchResult([]);
    }
  };

  return (
    <div className={`${style.searchPeople} ${customContainer}`}>
      <div className={`noButton__search ${style["noButton__search--mod"]}`}>
        <Search />
        <input placeholder="Search for people" onChange={handleSearch} />
      </div>
      {!!searchResult.length && (
        <div className={`${style.search__results} ${customResultsStyle}`}>
          {searchResult.map((user) => (
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
