import React, { useState } from 'react';
import { Box, HStack, Input, Button } from '@chakra-ui/react';
import { AiOutlineFolderAdd, AiOutlineFileAdd, AiOutlineFolder, AiOutlineFile, AiOutlineDelete } from 'react-icons/ai';
import { BsPencilSquare } from "react-icons/bs";


interface Item {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: Item[];
  isEditing?: boolean;
  newName?: string;
}


const Structure = () => {
  const [newItemType, setNewItemType] = useState<'folder' | 'file'>('folder');
  const [isAddingFolderFile, setIsAddingFolderFile] = useState<boolean>(false);
  const [newFolderFile, setNewFolderFile] = useState<string>('');
  const [showItems, setShowItems] = useState<Item[]>([
    {
      id: "1",
      name: "folder1",
      type: "folder",
      children: [],
    },
    {
      id: "2",
      name: "folder2",
      type: "folder",
      children: [],
    },
  ]);
  const [creatingFolderId, setCreatingFolderId] = useState<string | null>(null);
  const [isAddingSubFolder, setIsAddingSubFolder] = useState<boolean>(false);
  const [newSubFolderName, setNewSubFolderName] = useState<string>('');
  const [isAddingSubFile, setIsAddingSubFile] = useState<boolean>(false);
  const [newSubFileName, setNewSubFileName] = useState<string>('');

  const handleAddFolder = (type: 'folder' | 'file') => {
    setNewItemType(type);
    setIsAddingFolderFile(true);
  };

  const handleCreateFolder = () => {
    if (newFolderFile) {
      setShowItems([...showItems, { id: generateUniqueId(), name: newFolderFile, type: newItemType }]);
      setNewFolderFile('');
      setIsAddingFolderFile(false);
    }
  };
  

  const handleAddSubFolder = (id:string) => {
    setCreatingFolderId(id);
    setIsAddingSubFolder(true);
    setIsAddingSubFile(false);
    setNewSubFolderName('');
    setNewSubFileName('');
  };

   const handleCreateSubFolder = (parentId:string) => {
    if (newSubFolderName) {
      const updatedItems = [...showItems];
      recursivelyAddSubFolder(updatedItems, parentId, newSubFolderName);
      setShowItems(updatedItems);

      setNewSubFolderName('');
      setIsAddingSubFolder(false);
      setCreatingFolderId(null);
    }
  };

  const recursivelyAddSubFolder = (items:Item[], parentId:string, folderName:string) => {
    for (const item of items) {
      if (item.id === parentId && item.type === 'folder') {
        item.children = item.children || [];
        item.children.push({
          id: generateUniqueId(),
          name: folderName,
          type: 'folder',
          children: [],
        });
        break;
      } else if (item.children && item.children.length > 0) {
        recursivelyAddSubFolder(item.children, parentId, folderName);
      }
    }
  };

  const handleAddSubFile = (id:string) => {
    setCreatingFolderId(id);
    setIsAddingSubFile(true);
    setIsAddingSubFolder(false);
    setNewSubFileName('');
    setNewSubFolderName('');
  };

  const handleCreateSubFile = (parentId:string) => {
    if (newSubFileName) {
      const updatedItems = [...showItems];
      recursivelyAddSubFile(updatedItems, parentId, newSubFileName);
      setShowItems(updatedItems);

      setNewSubFileName('');
      setIsAddingSubFile(false);
      setCreatingFolderId(null);
    }
  };

  const recursivelyAddSubFile = (items:Item[], parentId:string, fileName:string) => {
    for (const item of items) {
      if (item.id === parentId && item.type === 'folder') {
        item.children = item.children || [];
        item.children.push({
          id: generateUniqueId(),
          name: fileName,
          type: 'file',
        });
        break;
      } else if (item.children && item.children.length > 0) {
        recursivelyAddSubFile(item.children, parentId, fileName);
      }
    }
  };

  const handleEdit = (id:string) => {
    const updatedItems = [...showItems];
    const findAndEdit = (items:Item[], id:string) => {
      for (const item of items) {
        if (item.id === id) {
          item.isEditing = true;
          item.newName = item.name;
          break;
        }
        if (item.children && item.children.length > 0) {
          findAndEdit(item.children, id);
        }
      }
    };
    findAndEdit(updatedItems, id);
    setShowItems(updatedItems);
  };

  const handleSaveEdit = (id:string) => {
    const updatedItems = [...showItems];
    const findAndSaveEdit = (items:Item[], id:string) => {
      for (const item of items) {
        if (item.id === id) {
          item.isEditing = false;
          if (item.newName) {
            item.name = item.newName;
            delete item.newName;
          }
          break;
        }
        if (item.children && item.children.length > 0) {
          findAndSaveEdit(item.children, id);
        }
      }
    };
    findAndSaveEdit(updatedItems, id);
    setShowItems(updatedItems);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id:string) => {
    const updatedItems = [...showItems];
    const findAndSetInput = (items:Item[], id:string, inputValue:string) => {
      for (const item of items) {
        if (item.id === id) {
          item.newName = inputValue;
          break;
        }
        if (item.children && item.children.length > 0) {
          findAndSetInput(item.children, id, inputValue);
        }
      }
    };
    findAndSetInput(updatedItems, id, e.target.value);
    setShowItems(updatedItems);
  };

  const handleDelete = (id:string) => {
    const updatedItems = [...showItems];
    const findAndDelete = (items:Item[], id:string) => {
      for (const item of items) {
        if (item.id === id) {
          const index = items.indexOf(item);
          if (index !== -1) {
            items.splice(index, 1);
            break;
          }
        }
        if (item.children && item.children.length > 0) {
          findAndDelete(item.children, id);
        }
      }
    };
    findAndDelete(updatedItems, id);
    setShowItems(updatedItems);
  };

  const renderFolderItem = (item:Item) => {
    return (
      <div key={item.id}>
        {item.isEditing ? (
          <Box fontSize="30px" display="flex" alignItems="center">
            <Input
              value={item.newName}
              onChange={(e) => handleInputChange(e, item.id)}
            />
            <Button onClick={() => handleSaveEdit(item.id)}>Save</Button>
          </Box>
        ) : (
          <Box fontSize="30px" display="flex" alignItems="center">
            <AiOutlineFolder /> {item.name}
            <Box ml="20px">
              {creatingFolderId === item.id && isAddingSubFolder ? (
                <>
                  <Input
                    placeholder="New Folder Name"
                    value={newSubFolderName}
                    onChange={(e) => setNewSubFolderName(e.target.value)}
                  />
                  <Button onClick={() => handleCreateSubFolder(item.id)}>Create</Button>
                </>
              ) : (
                <AiOutlineFolderAdd onClick={() => handleAddSubFolder(item.id)} />
              )}
            </Box>
            <Box ml="20px">
              {creatingFolderId === item.id && isAddingSubFile ? (
                <>
                  <Input
                    placeholder="New File Name"
                    value={newSubFileName}
                    onChange={(e) => setNewSubFileName(e.target.value)}
                  />
                  <Button onClick={() => handleCreateSubFile(item.id)}>Create</Button>
                </>
              ) : (
                <AiOutlineFileAdd onClick={() => handleAddSubFile(item.id)} />
              )}
            </Box>
            <Box ml="40px">
              <BsPencilSquare onClick={() => handleEdit(item.id)} />
            </Box>
            <Box ml="20px">
              <AiOutlineDelete onClick={() => handleDelete(item.id)} />
            </Box>
          </Box>
        )}

        {item.children && item.children.length > 0 && (
          <div style={{ marginLeft: '40px' }}>
            {item.children.map((childItem) => (
              <div key={childItem.id}>
                {childItem.type === 'folder' ? (
                  renderFolderItem(childItem)
                ) : (
                  renderFileItem(childItem)
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderFileItem = (item:Item) => {
    return (
      <div key={item.id}>
      {item.isEditing ? (
        <Box fontSize="30px" display="flex" alignItems="center">
          <Input
            value={item.newName}
            onChange={(e) => handleInputChange(e, item.id)}
          />
          <Button onClick={() => handleSaveEdit(item.id)}>Save</Button>
        </Box>
      ) : (
      <Box fontSize="30px" display="flex" alignItems="center" key={item.id}>
        <AiOutlineFile /> {item.name}
        <Box ml="40px">
          <BsPencilSquare onClick={() => handleEdit(item.id)} />
        </Box>
        <Box ml="20px">
          <AiOutlineDelete onClick={() => handleDelete(item.id)} />
        </Box>
      </Box>
      )}
      </div>
    );
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  return (
    <Box>
      <HStack>
        <Box fontSize="50px" onClick={() => handleAddFolder('folder')}>
          <AiOutlineFolderAdd />
        </Box>
        <Box fontSize="50px" onClick={() => handleAddFolder('file')}>
          <AiOutlineFileAdd />
        </Box>
      </HStack>
      {isAddingFolderFile ? (
        <>
          <Input
            placeholder="Name"
            value={newFolderFile}
            onChange={(e) => setNewFolderFile(e.target.value)}
          />
          <Button onClick={handleCreateFolder}>Create</Button>
        </>
      ) : (
        ''
      )}

      {showItems.map((item) => (
        <div key={item.id}>
          {item.type === 'folder' ? (
            renderFolderItem(item)
          ) : (
            renderFileItem(item)
          )}
        </div>
      ))}
    </Box>
  );
};

export default Structure;
