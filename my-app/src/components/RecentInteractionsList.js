
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const RecentInteractionsList = ({ interactions }) => (
  <div>
    <h3 className="font-bold text-lg text-gray-700 mb-4 px-3">Recent Interactions</h3>
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {interactions.length > 0 ? interactions.map(interaction => (
        <Link key={interaction.id} to={`/analysis/${interaction.id}`} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
          <p className="font-semibold text-gray-800">{interaction.studentName}</p>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
      )) : <p className="text-gray-500 px-3">No interactions found.</p>}
    </div>
  </div>
);

export default RecentInteractionsList;