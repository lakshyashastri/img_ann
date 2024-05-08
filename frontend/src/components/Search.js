import React from "react";
import { Autocomplete } from "@mantine/core";

function SearchComponent() {
	return (
		<Autocomplete
			label="Your favorite library"
			placeholder="Pick value or enter anything"
			data={["React", "Angular", "Vue", "Svelte"]}
			comboboxProps={{
				transitionProps: { transition: "pop", duration: 200 }
			}}
		/>
	);
}

export default SearchComponent;
