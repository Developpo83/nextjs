import { MongoClient } from "mongodb"; //this is an object which allows us to connect

// /api/new-meetup

async function handler(req, res) {
	if (req.method === "POST") {
		const data = req.body;

		const client = await MongoClient.connect(
			"mongodb+srv://Luca:Nextjs83@cluster0.ryhfa.mongodb.net/meetups?retryWrites=true&w=majority"
		); //this is code you never want to run on the client side (security problems)

		const db = client.db("meetups");

		const meetupsCollection = db.collection("meetups");

		const result = await meetupsCollection.insertOne(data);
		//reuslt wil be an objet with automatically generated ID
		console.log(result);
		client.close(); //to close database connection once we're done

		res.status(201).json({ message: "Meetup inserted!" });
	}
}

// With that, however, we have a basic API route,
// which will insert meetups into our database
// and therefore, in the next step,
// we can now send a request to this API route,
// from the front end when this form here is submitted,
// so that we actually do trigger this API route
// and we use that code here.

export default handler;
