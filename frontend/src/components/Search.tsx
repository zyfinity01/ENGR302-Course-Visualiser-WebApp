import { Input } from '@material-tailwind/react'
import { ChangeEvent, useState } from 'react'

interface SearchProps {
  onSearch: (course: string) => void
  choices: string[] | undefined
}

const Search: React.FC<SearchProps> = ({ onSearch, choices }) => {
  const [searchInput, setSearchInput] = useState('')
  const [filteredChoices, setFilteredChoices] = useState<string[]>([])

  const onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(value)

    if (!choices) return

    if (value) {
      setFilteredChoices(
        choices.filter((choice) =>
          choice.toLowerCase().includes(value.toLowerCase())
        )
      )
    } else {
      setFilteredChoices([])
    }
  }

  return (
    <div className="relative w-64">
      <Input
        type="text"
        label="Find course"
        color="green"
        value={searchInput}
        onChange={onChange}
        onKeyDown={(event) => event.key === 'Enter' && onSearch(searchInput)}
        crossOrigin={undefined}
      />
      {filteredChoices.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full bg-white shadow-lg max-h-52 rounded-md overflow-y-auto">
          {filteredChoices.map((choice, index) => (
            <li
              key={index}
              className="cursor-pointer hover:bg-green-600 hover:text-white px-3 py-2"
              onClick={() => {
                setSearchInput(choice)
                setFilteredChoices([])
                onSearch(choice)
              }}
            >
              {choice}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Search
