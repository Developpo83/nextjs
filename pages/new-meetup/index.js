// our-domain.com/new-meetup
import { useRouter } from "next/router";
import NewMeetupForm from "../../components/meetups/NewMeetupForm";

function NewMeetupPage() {
	const router = useRouter();
	async function addMeetupHandler(enteredMeetupData) {
		const response = await fetch("/api/new-meetup", {
			//this will send a request to new-meetup.js file in the API folder and NEXT.js will trigger the handler function (when a request reaches this path)
			method: "POST", //the second argument in fetch will configure this request
			body: JSON.stringify(enteredMeetupData),
			headers: { "Content-Type": "application/json" },
		});
		const data = await response.json();
		console.log(data);
		router.push("/");
	}

	return <NewMeetupForm onAddMeetup={addMeetupHandler} />;
}

export default NewMeetupPage;
