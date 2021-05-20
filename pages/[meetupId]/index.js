import { MongoClient, ObjectId } from "mongodb"; //this is an object which allows us to connect

import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
	// i props li prende da sotto, in questa stesssa pagina, è cio che ritorna getStaticProps(context)
	return (
		<MeetupDetail
			image={props.meetupData.image}
			title={props.meetupData.title}
			address={props.meetupData.address}
			description={props.meetupData.description}
		/>
	);
}

export async function getStaticPaths() {
	const client = await MongoClient.connect(
		"mongodb+srv://Luca:Nextjs83@cluster0.ryhfa.mongodb.net/meetups?retryWrites=true&w=majority"
	);

	const db = client.db();
	const meetupsCollection = db.collection("meetups");

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
	client.close();

	return {
		fallback: true,
		paths: meetups.map((meetup) => ({
			params: {
				meetupId: meetup._id.toString(),
			},
		})),
	};
}

export async function getStaticProps(context) {
	const meetupId = context.params.meetupId; //meetupId is the identifier I have between [] as page name which refers a dynamic name/id

	const client = await MongoClient.connect(
		"mongodb+srv://Luca:Nextjs83@cluster0.ryhfa.mongodb.net/meetups?retryWrites=true&w=majority"
	);

	const db = client.db();
	const meetupsCollection = db.collection("meetups"); // get access to the collection
	// now I want to get access to a single meetup
	const selectedMeetup = await meetupsCollection.findOne({
		_id: ObjectId(meetupId), //will convert the string meetupId into such a BSON objectId object (POI DOBBIAMO convertire IN STRINGA questa proprietà _id nell'oggetto selectedMeetup)
	}); //se l'id pescato dal mongodb servere = all'id letto sulla barra indirizzi..

	// const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
	client.close();

	return {
		// per precaricare sul server, assieme alla struttura HTML del sito, nella pagina da scaricare subito e da mostrare per motori ricerca (SEO) dei dati attraverso i props
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(), //abbiamo riconvertito in stringa ciò che prima trasformammo in BSON object per motivi di ricerca findOne()
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,

				//now these meetup detail pages are prerendered on the server dynamically
			},
		},
	};
}

export default MeetupDetails;
