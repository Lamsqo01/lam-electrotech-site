# LAM ELECTROTECH

Site statique en français pour présenter les services de LAM ELECTROTECH et orienter les demandes de particuliers et de professionnels partout au Bénin.

## Pages

- `index.html` : accueil, services, assistant de préparation, conseils, FAQ, devis et contact.
- `electricite.html`, `videosurveillance.html`, `antennes.html`, `solaire.html`, `maintenance.html` : pages détaillées des prestations, avec bénéfices et limites à prendre en compte.
- `normes-securite.html` : repères de prévention, signaux de danger, erreurs à éviter, précautions par domaine et liens vers les sources officielles béninoises et les référentiels IEC cités. Les liens distinguent l’existence d’un texte de son applicabilité à un projet ; les exigences réglementaires doivent être confirmées auprès des organismes compétents au Bénin.
- `depannage.html` : parcours séparé de signalement d’une panne.
- `politique-confidentialite.html` : fonctionnement actuel des échanges et données.
- `mentions-legales.html` : mentions préparées, à compléter avec l’identité juridique et l’hébergeur réels.
- `offline.html` : page de repli en cas de navigation hors connexion.
- `404.html` : page d’erreur à configurer comme page 404 auprès de l’hébergeur.
- `robots.txt` : autorise l’indexation des pages publiques et exclut la page hors connexion.

## Prévisualisation et publication

Les fichiers peuvent être prévisualisés directement depuis `index.html`. Pour tester l’installation de l’application et le cache hors connexion, servir le dossier depuis `localhost` ou un hébergement en HTTPS : les navigateurs n’autorisent pas les service workers depuis une URL `file://`.

Publier ensemble les pages HTML, `styles.css`, `script.js`, `manifest.webmanifest`, `service-worker.js`, les icônes SVG, `contact.vcf` et `robots.txt`. Configurer également `404.html` comme page d’erreur chez l’hébergeur. Le service worker précharge les pages et ressources locales et propose une page de repli lorsque le réseau est absent.

## Parcours de contact

Les formulaires ne transmettent pas les réponses à un serveur. Ils préparent un message contextualisé dans WhatsApp ; la personne peut le vérifier, le modifier, joindre des photos dans la conversation et l’envoyer elle-même. Les boutons d’appel utilisent directement les deux numéros communiqués par l’entreprise.

L’assistant de préparation est guidé par des choix et des questions définis sur le site. Il ne s’agit pas d’un modèle d’IA générative, d’un diagnostic à distance ou d’un système de prise de rendez-vous.

## À finaliser avant publication

- Remplacer le symbole provisoire par le logo officiel.
- Ajouter les photos réelles des interventions, avec les autorisations nécessaires.
- Compléter l’identification de l’éditeur et de l’hébergeur dans `mentions-legales.html` avec les informations exactes de l’entreprise.
- Choisir le domaine et configurer son DNS, HTTPS, l’URL canonique, l’image de partage social, un sitemap adapté au domaine et la propriété du site dans les outils de référencement.
- Configurer les réponses d’hébergement pour les types de fichiers statiques et la page `404.html`.
- Mettre à jour la politique de confidentialité si un backend, des fichiers téléversés, des statistiques ou d’autres services tiers sont ajoutés.
