'use client';

import api from '@/lib/axios';
import { useEffect, useState } from 'react';
import Card from "@/components/Card";
import CardEdit from "@/components/CardEdit";
import '@/styles/cards.css';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function Cards() {
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [newCardName, setNewCardName] = useState("");
  const [cardToEdit, setCardToEdit] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);

  const router = useRouter();
  const {user, isLoading} = useUser();

  useEffect(() => {
    if (!isLoading && !user) { router.push("/auth/login") }
    api.get("card/get")
      .then((res) => {
        const sortedCards = res.data.sort((a, b) => a.id - b.id);
        setCards(sortedCards);
      });

    api.get("card/get_active")
      .then((res) => {
        setActiveCard(res.data);
      })
      .catch(() => {
        setActiveCard(null);
      });
  }, []);

  useEffect(() => {
    if (!showPopup) {
      setCardToDelete(null);
      setCardToEdit(null);
    }
  }, [showPopup]);


  const activateCard = (card) => {
    setActiveCard(card);
    api.post("flow/start_flow", { card_id: card.id });
  };

  const createCard = (name) => {
    api.post("card/create", { name })
      .then((res) => {
        const newCard = res.data;
        setCards([...cards, newCard]);
        setShowPopup(false);
        setNewCardName("");
      })

  };

  const deleteCard = (cardId) => {
    api.post("card/delete", { id: cardId })
      .then(() => {
        setCards((prev) => prev.filter((c) => c.id !== cardId));
      }).then(() => {
        setShowPopup(false);
        setCardToDelete(null);
      })
  };

  const openEditPopup = (card) => {
    setCardToEdit(card);
    setNewCardName(card.name);
    setShowPopup(true);
  };

  const openDeletePopup = (card) => {
    setCardToDelete(card);
    setShowPopup(true);
  };

  const updateCard = (cardId, newName) => {

    api.post("card/edit", { id: cardId, name: newName })
      .then(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === cardId ? { ...c, name: newName } : c
          )
        );
        setShowPopup(false);
        setNewCardName("");
        setCardToEdit(null);
      })
  };

  const handleSubmit = () => {
    const name = newCardName.trim();

    if (cardToDelete) {
      deleteCard(cardToDelete.id);
    }
    else {
      if (!name) return;
      if (cardToEdit) {
        updateCard(cardToEdit.id, name);
      } else {
        createCard(name);
      }
    }
  };

  return (
    <div className='cards-page'>
      <div className='card-block'>
        {!cards.length && !activeCard ? (
          <span>Loading...</span>
        ) : (
          <>
            {!isEditing && (
              <div className='info-block'>
                <span className='now-info'>
                  Now active: {activeCard ? activeCard.name : 'Nothing'}
                </span>
              </div>
            )}

            <div className='card-list'>
              {isEditing ? (
                cards.map((card) => (
                  <CardEdit
                    key={card.id}
                    card={card}
                    onOpenEditPopup={openEditPopup}
                    onOpenDeletePopup={openDeletePopup}
                  />
                ))
              ) : (
                cards.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    isActive={card.id === activeCard?.id}
                    activateCard={activateCard}
                  />
                ))
              )}
            </div>

            <div className='card-action-block'>
              {isEditing ? (
                <button
                  className='edit-cards-btn'
                  onClick={() => setIsEditing(false)}
                >
                  Finish editing
                </button>
              ) : (
                <>
                  <button
                    className='edit-cards-btn'
                    onClick={() => setIsEditing(true)}
                  >
                    Edit cards
                  </button>
                  <button
                    className='create-card-btn'
                    onClick={() => {
                      setCardToEdit(null);
                      setNewCardName("");
                      setShowPopup(true);
                    }}
                  >
                    Add card
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {showPopup && (
          <div className='popup-overlay' onClick={() => setShowPopup(false)}>
            {cardToDelete ? (
              <div className='popup' onClick={(e) => e.stopPropagation()}>
                <h3>Are you sure you want to delete: {cardToDelete.name}?</h3>

                <div className='popup-delete-btns'>
                  <button className='submit-btn' onClick={() => setShowPopup(false)}>
                    Cancel
                  </button>
                  <button className='delete-submit-btn' onClick={handleSubmit}>
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className='popup' onClick={(e) => e.stopPropagation()}>
                <h3>{cardToEdit ? 'Edit Card' : 'Add New Card'}</h3>
                <input
                  type='text'
                  placeholder='Card name'
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                />
                <button className='submit-btn' onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}


