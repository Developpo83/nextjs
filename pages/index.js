import Head from "next/head"; //This is a component which allows you to add Head elements to the Head section of your page.
import { MongoClient } from "mongodb"; //the import package in the serverd will not be part of the client side bundle, there will be two different indipendent bundle for server and client
import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from "react";

const DUMMY_MEETUPS = [
	{
		id: "m1",
		title: "A First Meetup",
		image:
			"https://media.istockphoto.com/photos/colosseum-in-rome-and-morning-sun-italy-picture-id539115110?k=6&m=539115110&s=612x612&w=0&h=qPtL_QLre-LJ1_HYrxtK_J_OnhKEMLFygB6YfIBda4s=",
		address: "Some address 5 12345 Rome",
		description: "this is a first meetup",
	},
	{
		id: "m2",
		title: "A Second Meetup",
		image:
			"https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.upp-prod-us.s3.amazonaws.com%2Ffb181f10-4b77-11e9-bbc9-6917dce3dc62?fit=scale-down&source=next&width=700",
		address: "Some address 10 67891 Florence",
		description: "this is a second meetup",
	},
];

function HomePage(props) {
	return (
		<Fragment>
			<Head>
				<title>React Meetup correctly added</title>
				<meta
					name="description"
					content="Browse a huge list of highly active React meetups"
				/>
			</Head>
			<MeetupList meetups={props.meetups} />
		</Fragment>
	);
}

export async function getStaticProps() {
	// fetch data from an API
	const client = await MongoClient.connect(
		"mongodb+srv://Luca:Nextjs83@cluster0.ryhfa.mongodb.net/meetups?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	);

	const db = client.db();
	const meetupsCollection = db.collection("meetups");

	// once we do connect nd reach out the meetupsCollection we can use the find() method that by default returns all the documents

	const meetups = await meetupsCollection.find().toArray(); //we get back an array of dicuments
	client.close(); //close the connection with Mongodb

	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString(), //Returns a string representation of an object.
			})), // fetched from Mongodb
		},
		revalidate: 1, // in secondi, 3600 per un'ora
	};
}

export default HomePage;
