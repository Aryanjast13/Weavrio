import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

type Filter = {
 
  gender: string;
  color: string;
  size: string[];
  minPrice: number;
  maxPrice: number;
  [key: string]: string | string[] | number;
};

export function useFilterSidebar() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filter>({
    gender: "",
    color: "",
    size: [],
    minPrice: 0,
    maxPrice: 3000,
  });

  const [priceRange, setPriceRange] = useState([0, 3000]);

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      gender:params.gender||"",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      minPrice: parseInt(params.minPrice) || 0,
      maxPrice: parseInt(params.maxPrice) || 3000,
    });

    setPriceRange([0, parseInt(params.maxPrice) || 3000]);
  }, [searchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    let newFilters: Filter = { ...filters };

    if (type === "checkbox") {
      //handle array properties (size,material,brand)
      const currentArray = newFilters[name as keyof Filter] as string[];
      if (checked) {
        newFilters[name] = [...currentArray, value] as string[];
      } else {
        newFilters[name] = currentArray.filter((item) => item !== value) as any;
      }
    } else if (type === "radio") {
      // Handle string properties (category, gender)
      newFilters[name] = value as string;
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handleButtonClick = (color: string) => {
    let newFilters: Filter = { ...filters };
    if (color) {
      newFilters.color = color;
    }
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseInt(e.target.value);
    setPriceRange([0, newPrice]);
    let newFilters: Filter = { ...filters };
    newFilters.maxPrice = newPrice;
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters: Filter) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key] as any);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };
    
    return {
        handleButtonClick,handlePriceChange,filters,handleFilterChange,priceRange
    }
}
