export const GroupCard = ({ name }: { name: string }) => {
  return (
    <div className="bg-white rounded-xl p-2 flex gap-4 border border-gray-200 cursor-pointer pr-8 flex-shrink-0">
      <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0" />
      
      <div className="flex flex-col flex-grow justify-between">
        <div className="flex -space-x-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
            />
          ))}
        </div>
        <h3 className="text-xl text-gray-800 font-dm-sans font-medium">{name}</h3>
        <p className="text-xs text-gray-500 font-dm-sans font-medium">8 upcoming meetings</p>
        
        
      </div>
    </div>
  )
}