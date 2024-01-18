import slugify from 'slugify'

const generateRandomString = (): string => {
  return (Math.random() + 1).toString(36).substring(7)
}

const generateRandomStringUsingList = (listOfWords: string[]): string => {
  listOfWords.push(generateRandomString())
  return slugify(listOfWords.join(' '))
}

export { generateRandomStringUsingList }
