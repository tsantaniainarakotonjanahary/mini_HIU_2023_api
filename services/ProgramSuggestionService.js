const MongoClient = require("mongodb").MongoClient;
const openai = require("../local-modules/openai/openaiLocal");

const suggestProgramFromTodo = async (etudiantId) => {
  const client = new MongoClient(
    "mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  );
  await client.connect();
  const db = client.db("hiu");
  const date = new Date();
  date.setHours(date.getHours() + 3);
  date.setUTCHours(0, 0, 0, 0);
  const dayId = date.getDay() - 1;
  console.log(etudiantId, dayId);
  const todos = await db
    .collection("todo")
    .find({ etudiantId: etudiantId, date_today: date, isDone: "no" })
    .toArray();
  const programs = [];
  const cursor = await db
    .collection("program")
    .find({ etudiantId: etudiantId });
  await cursor.forEach((program) => {
    if (!isNaN(parseInt(program.numJour))) {
      if (parseInt(program.numJour) === dayId) {
        // console.log
        programs.push(program);
      }
    }
  });

  const prompt = `
        J'ai une liste de todo pour un etudiant
        ${todos}
        
        Et ici son emploi du temps de la journée
        ${programs}

        Cree un fichier JSON en inserant les todos dans la liste des emplois du temps
        en suggerant l'horaire de debut et fin de chaque todo
        afin de faire en sorte que les temps d'execution des todos
        et des emplois du temps ne se chevauchent pas,
        où les champs porteront les champs (tu completes les champs heure_debut et heure_fin comme je l'ai dit 
        precedemment) "heure_debut" qui sera ta suggestion du debut du todo, "heure_fin" la suggestion 
        de la fin du todo, "matiere" qui prendra en valeur la valeur du champ "matiere" du todo
        Fais attention , si Par exemple un emploi du temps est entre 11:00 et 12:00, 
        aucun autre todo ne doit commencer ni se terminer entre 11h:00min et 12h:00min
        Par exemple si l'emploi du temps est comme suit :
        [
            {
                "_id": "6409a8667ac7430d2ebfe01b",
                "etudiantId": "64063960c2f732da57d49878",
                "heure_debut": "10:00",
                "heure_fin": "12:00",
                "matiere": "Psychologie",
                "theme": "",
                "numJour": 0
            }
        ],

        et la liste de todo comme suit :

        [
            {
                "_id": "640acec9c65a7402cb1d1bbe",
                "etudiantId": "64063960c2f732da57d49878",
                "date_today": "2023-03-10T00:00:00.000Z",
                "tache": "Apprendre l'anglais",
                "isDone": "no"
            },
            {
                "_id": "640aced1c65a7402cb1d1bbf",
                "etudiantId": "64063960c2f732da57d49878",
                "date_today": "2023-03-10T00:00:00.000Z",
                "tache": "Faire du shopping",
                "isDone": "no"
            }
        ]

        J'aimerai ce genre de reponse :

        [
            {
                "_id": "6409a8667ac7430d2ebfe01b",
                "etudiantId": "64063960c2f732da57d49878",
                "heure_debut": "10:00",
                "heure_fin": "12:00",
                "matiere": "Psychologie",
                "theme": "",
                "numJour": 0
            },
            {
                "heure_debut": "10:00",
                "heure_fin": "12:00",
                "matiere": "Apprendre l'anglais",
            },
            {
                "heure_debut": "10:00",
                "heure_fin": "12:00",
                "matiere": "Faire du shopping",
            },
        ],
    `;

  try {
    const completions = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 3000,
    });
    client.close();
    const newList = JSON.parse(completions.data.choices[0].text.trim());
    console.log(completions.data.choices[0].text)
    return 'newList'
  } catch (err) {
    console.log(err);
    throw err;
  }
};
module.exports = {
  suggestProgramFromTodo,
};
