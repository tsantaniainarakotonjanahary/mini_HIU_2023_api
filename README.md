# mini_HIU_2023_api

# API DOCS

## Generate a quizz from a subject based on a theme

### - DOCUMENTATION -

- **URL** : https://mini-hiu-2023-api.vercel.app/level-test/generate
- **Method** : POST
- **Headers**

  ```
  Content-Type : application/json
  x-auth-token : <token user>
  ```

- **Body** (json)

  ```json
  {
    "subject": "mathematique", // To choose
    "theme": "limite" // To choose
  }
  ```

- **EX OF RESPONSE**:
  ```json
  {
    "datas": [
      {
        "question": "La limite d'une fonction f(x) quand x tend vers 0 est?",
        "choix": ["2", "x", "∞", "1"],
        "idReponse": 1
      },
      {
        "question": "Donnez une définition de la limite?",
        "choix": [
          "Une quantité fixe non définie",
          "Une quantité approchant l'infini",
          "Une quantité qui se rapproche indéfiniment d'une valeur donnée quand la variable approche d'une valeur donnée",
          "Une quantité impulsée par l'infini"
        ],
        "idReponse": 2
      }
    ]
  }
  ```

### - JAVASCRIPT CODE EXAMPLE | FETCH -

```js
const token = "<token user>";
const url = "https://mini-hiu-2023-api.vercel.app/level-test/generate";

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-auth-token": token,
  },
  body: JSON.stringify({
    subject: "mathematique",
    theme: "limite",
  }),
};

fetch(url, options)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

## Generate a list of lessons to learn for a subject based on the theme

### - DOCUMENTATION -

- **URL** : https://mini-hiu-2023-api.vercel.app/lesson/generate
- **Methode** : POST
- **Headers**

  ```
  Content-Type : application/json
  x-auth-token : <token user>
  ```

- **Body** (json)
  ```json
  {
    "subject": "mathematique", // à choisir
    "theme": "limite" // à choisir
  }
  ```
- **EX OF RESPONSE**

  ```json
  {
    "datas": [
      {
        "lessonTitle": "Limites des fonctions continues",
        "suggestedWebsites": [
          {
            "title": "Limites et fonctions continues",
            "link": "http://math.univ-lyon1.fr/~frabetti/AnalyseI/CM4-limites+continue+graphes.pdf",
            "snippet": "Opérations sur les limites de fonctions continues: Sif et g sont deux fonctions telles que g admet une limite finie en zo € Dg, i.e. lim g(x) - (ЄR, est ...",
            "displayedLink": "http://math.univ-lyon1.fr › ~frabetti › AnalyseI"
          },
          {
            "title": "Résumé de cours : limites et continuité - BibM@th",
            "link": "https://www.bibmath.net/ressources/index.php?action=affiche&quoi=mathsup/cours/limitecontinuite.html",
            "snippet": "On parle de continuité à droite ou de continuité à gauche lorsqu'on utilise les notions de limite à droite et de limite à gauche. On dit que f f est continue ...",
            "displayedLink": "https://www.bibmath.net › ressources › limitecontinuite"
          }
        ]
      },
      {
        "lessonTitle": "Limites tendant vers l'infini",
        "suggestedWebsites": [
          {
            "title": "Fiche explicative de la leçon : Limites à l'infini - Nagwa",
            "link": "https://www.nagwa.com/fr/explainers/549183454070/",
            "snippet": "A. Limite à l'infini · Notation. On note x→+∞​lim​f(x)=+∞. · Remarque. Autrement dit, x→+∞​lim​f(x)=+∞ lorsque, pour tout réel A, l'intervalle [A;+∞[ ...",
            "displayedLink": "https://www.nagwa.com › explainers"
          },
          {
            "title": "Limites de fonctions : définitions et premières propriétés",
            "link": "https://www.lelivrescolaire.fr/page/6473037",
            "snippet": "On appelle « limite d'une fonction » la valeur que semble prendre cette fonction pour un réel, un intervalle, ou un signe à l'infini donnés ; cette valeur peut ...",
            "displayedLink": "https://www.lelivrescolaire.fr › page"
          }
        ]
      }
    ]
  }
  ```

### - JAVASCRIPT CODE EXAMPLE | FETCH -

```js
const token = "<token user>";
const url = "https://mini-hiu-2023-api.vercel.app/lessons/generate";

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-auth-token": token,
  },
  body: JSON.stringify({
    subject: "mathematique",
    theme: "limite",
  }),
};

fetch(url, options)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```
