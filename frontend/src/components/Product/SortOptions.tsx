
import { useSearchParams } from "react-router";

const SortOptions = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e:React.ChangeEvent<HTMLSelectElement>) =>{
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy);
    setSearchParams(searchParams);
  }

  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        id="sort"
        className="border font-medium p-2 rounded-md focus:outline-none"
        onChange={handleSortChange}
        value={searchParams.get("sortBy") || ""}
      >
        <option value="">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDes">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
}

export default SortOptions