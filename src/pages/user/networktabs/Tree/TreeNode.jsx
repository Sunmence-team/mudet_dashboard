import React, { useState } from 'react'
import TreeCard from '../../../../components/cards/TreeCard';

const TreeNode = ({ isLoading, node, level = 0 }) => {
    const [expandedNodes, setExpandedNodes] = useState(new Set(['root']));
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGeneration, setSelectedGeneration] = useState('all');
    
    const toggleNode = (nodeId) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };
    
    const filterByGeneration = (node, generation) => {
        if (generation === 'all') return true;
        return node.generation === parseInt(generation);
    };
    
    const searchInTree = (node, term) => {
        if (!term) return true;
        return node.username.toLowerCase().includes(term.toLowerCase());
    };


    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.left || node.right;
    const shouldShow = filterByGeneration(node, selectedGeneration) && searchInTree(node, searchTerm);

    if (!shouldShow) return null;

    if (isLoading) {
        return <div className='w-10 h-10 border-4 border-pryClr border-t-transparent rounded-full animate-spin'></div>
    }

    return (
        <div className="relative flex flex-col items-center">
            <div className={`relative z-10 flex flex-col items-center`}>
                <TreeCard
                    user={node}
                    isExpanded={isExpanded}
                    onToggle={toggleNode}
                    hasChildren={hasChildren}
                />
            </div>
            {isExpanded && hasChildren && (
                <div className={`${node.left && node.right ? "mt-28" : "mt-16"} flex gap-8 items-start justify-center relative`}>
                    {node.left && (
                        <div className={`relative z-20 flex flex-col items-center children-card ${node.right ? "left-card" : ""}`}>
                            <TreeNode node={node.left} level={level + 1} />
                        </div>
                    )}
                    {node.right && (
                        <div className={`relative z-20 flex flex-col items-center children-card ${node.left ? "right-card" : ""}`}>
                            <TreeNode node={node.right} level={level + 1} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );

}

export default TreeNode