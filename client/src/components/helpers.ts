const calcResults = (answers) => {
  const reachedPoints = answers.filter(a => a.points > -1).reduce((acc, answer) => acc += answer.points, 0)
  const maxPoints = answers.filter(a => a.points > -1).reduce((acc, answer) => acc += 2, 0)
  if (reachedPoints < maxPoints / 3) {
    return {
      title: "Gullible Globetrotter", text: `Careful! You’re heading for a risky decision. Build an awareness of what could potentially lay ahead if you were to decide to leave Afghanistan and this will help you to make an informed decision. Keep in mind that individuals with protection needs have the right to claim asylum. Despite this, it’s important to know that asylum procedures are often imperfect and the experience of seeking asylum can have a lasting impact on individuals.
  
          We can all become Tuned-in Travellers by doing 👇 first:
          ·      Stop and think - Does this sound true?
          ·      Check the source – are they trustworthy?
          ·      Double check with a trustworthy source like UNHCR
          ·      Search to see if other reliable sites are also writing about the issue
        `, reachedPoints: reachedPoints, class: "bg-danger"
    }
  } else if (maxPoints / 3 < reachedPoints && reachedPoints < maxPoints / 1.5) {
    return {
      title: "Junior Journeyer", text: `ou’re at risk of making a biased decision. Keep building an awareness of what could potentially lay ahead if you were to decide to leave Afghanistan. This will help you to make an informed decision. Keep in mind that individuals with protection needs have the right to claim asylum. Despite this, it’s important to know that asylum procedures are often imperfect and the experience of seeking asylum can have a lasting impact on individuals.
  
          You know that many things shared on Facebook or by friends and family aren’t always true or valid so try to get your information from official sources, like UNHCR.
          
          
          We can all become Tuned-in Travellers by doing 👇 first:
          ·      Stop and think - Does this sound true?
          ·      Check the source – are they trustworthy?
          ·      Double check with a trustworthy source like  UNHCR
          ·      Search to see if other reliable sites are also writing about the issue`, reachedPoints: reachedPoints, class: "bg-warning"
    }
  } else {
    return {
      title: "Tuned-in Traveller", text: `Great! You’re starting to build an awareness of what could potentially lay ahead if you were to decide to leave Afghanistan. This will help you to make an informed decision. You know that individuals with protection needs have the right to claim asylum. Despite this, you understand that asylum procedures are often imperfect and the experience can have a lasting impact on individuals.
  
          You know that many things shared on Facebook or by friends and family aren’t always true or valid so you also seek out information from official sources, like UNHCR.
  
          
          You follow international guidance, and you keep informed about the latest developments in migration policy.
            
          You can help protect yourself by doing 👇 before migrating:
          ·      Stop and think - Does this sound true?
          ·      Check the source – are they trustworthy?
          ·      Double check with a trustworthy source like UNHCR
          ·      Search to see if other reliable sites are also writing about the issue`, reachedPoints: reachedPoints, class: "bg-success"
    }
  }
}
const getTheme = (host: string): number => {
  let test = 0
  if (test === 1 || host === "micompass.org") {
    return 1
  } else if (test === 2 || host === "ua.tmy.io") {
    return 2
  } else {
    return 1
  }
}
const isAdmin = (path) => ['/dashboard', '/history'].includes(path)
export { calcResults, getTheme, isAdmin }