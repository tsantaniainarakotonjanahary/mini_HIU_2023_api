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

## Generate a list of lesson to learn for a subject based on the theme

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
      "Comprendre le concept de limite",
      "Comprendre comment les fonctions se comportent en approchant une limite",
      "Trouver les limites numeriques d'une fonction",
      "Trouver les limites infinies d'une fonction",
      "Trouver les limites a l'infini d'une fonction",
      "Comprendre les limites discontinues",
      "Comprendre les limites infinites d'une fonction",
      "Comprendre les limites de deux fonctions",
      "Utiliser le theoreme de l'hopital lors du calcul des limites",
      "Résoudre des équations avec des limites",
      "Comprendre le concept de limite de convergence"
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