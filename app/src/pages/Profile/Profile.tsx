import style from "./Profile.module.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/AuthContainer";
import useStores from "../../hooks/useStores";
import { editCurrentUser } from "../../services/AuthService";

import Sidenav from "../../components/Sidenav/Sidenav";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

const Profile = () => {
	const navigate = useNavigate();

	const [userId, setUserId] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [firstname, setFirstname] = useState<string>("");
	const [lastname, setLastname] = useState<string>("");
	const [phone, setPhone] = useState<string | undefined>();
	const [streetNumber, setStreetNumber] = useState<string | undefined>();
	const [postcode, setPostcode] = useState<string | undefined>();
	const [city, setCity] = useState<string | undefined>();
	const [country, setCountry] = useState<string | undefined>();
	const [role, setRole] = useState<string>("");
	const [isEditing, setIsEditing] = useState<Boolean>(false);
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	const { logout } = useAuthContext();
	const { UiStore } = useStores();

	// Type userBody to send with API call
	const userBody = {
		_id: userId,
		email: email,
		firstname: firstname,
		lastname: lastname,
		phone: phone,
		street_number: streetNumber,
		postal_code: postcode,
		city: city,
		country: country,
		role: role,
	};

	// Wait for currentUser to be set and set user data when loaded
	useEffect(() => {
		const waitForUser = async () => {
			if (!UiStore.currentUser) {
				await new Promise<void>((resolve) => {
					const interval = setInterval(() => {
						if (UiStore.currentUser) {
							clearInterval(interval);
							resolve();
						}
					}, 100);
				});
			}
			setIsLoading(false);

			if (UiStore.currentUser) {
				setUserId(UiStore.currentUser._id);
				setEmail(UiStore.currentUser.email);
				setFirstname(UiStore.currentUser.firstname);
				setLastname(UiStore.currentUser.lastname);
				setPhone(UiStore.currentUser.phone);
				setStreetNumber(UiStore.currentUser.street_number);
				setPostcode(UiStore.currentUser.postal_code);
				setCity(UiStore.currentUser.city);
				setCountry(UiStore.currentUser.country);
				setRole(UiStore.currentUser.role);
			}
		};

		waitForUser();
	}, [UiStore, navigate]);

	// Logout function
	const handleLogout = () => {
		logout();
	};

	// Show edit UI
	const handleStartEdit = () => {
		setIsEditing(true);
	};

	// Hide edit UI
	const handleStopEdit = () => {
		setIsEditing(false);
	};

	// Function to edit user
	const handleEdit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!UiStore.currentUser || !UiStore.currentUser._id) {
			return;
		}

		setIsLoading(true);
		editCurrentUser(userBody)
			.then(() => {
				setIsEditing(false);
				setIsLoading(false);
				// Update the UiStore
				UiStore.setCurrentUser(userBody);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	if (isLoading)
		return (
			<div className={style.container}>
				<Sidenav />
				<Loading />
			</div>
		);
	else if (error)
		return (
			<div className={style.container}>
				<Sidenav />
				<Error />
			</div>
		);
	else
		return (
			<div className={style.container}>
				<Sidenav />
				<div className={style.main}>
					<button className={style.logout_btn} onClick={handleLogout}>
						Logout
					</button>
					{isEditing ? (
						<form className={style.profile_form} onSubmit={handleEdit}>
							<div className={style.info}>
								<div className={style.personal_info}>
									<h1 className={style.title}>Persoonlijke gegevens</h1>
									{UiStore.currentUser ? (
										<>
											<label
												htmlFor="firstname"
												className={style.profile_form__label}
											>
												Voornaam
											</label>
											<input
												name="firstname"
												id="firstname"
												className={style.profile_form__input}
												value={firstname}
												onChange={(e) => setFirstname(e.target.value)}
												required
											></input>
											<label
												htmlFor="lastname"
												className={style.profile_form__label}
											>
												Achternaam
											</label>
											<input
												name="lastname"
												id="lastname"
												value={lastname}
												onChange={(e) => setLastname(e.target.value)}
												className={style.profile_form__input}
												required
											></input>
											<label
												htmlFor="email"
												className={style.profile_form__label}
											>
												Email
											</label>
											<input
												type="email"
												name="email"
												id="email"
												className={style.profile_form__input}
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												required
											/>
											<label
												htmlFor="phone"
												className={style.profile_form__label}
											>
												Telefoonnummer
											</label>
											<input
												type="phone"
												name="phone"
												id="phone"
												className={style.profile_form__input}
												value={phone}
												onChange={(e) => setPhone(e.target.value)}
											/>
										</>
									) : (
										"Geen gebruiker gevonden"
									)}
								</div>
								<div className={style.address_info}>
									<h1 className={style.title}>Adres</h1>
									{UiStore.currentUser ? (
										<>
											<label
												htmlFor="streetNumber"
												className={style.profile_form__label}
											>
												Straat en nummer
											</label>
											<input
												name="streetNumber"
												id="streetNumber"
												className={style.profile_form__input}
												value={streetNumber}
												onChange={(e) => setStreetNumber(e.target.value)}
											></input>
											<label
												htmlFor="postcode"
												className={style.profile_form__label}
											>
												Postcode
											</label>
											<input
												name="postcode"
												id="postcode"
												value={postcode}
												onChange={(e) => setPostcode(e.target.value)}
												className={style.profile_form__input}
											></input>
											<label
												htmlFor="city"
												className={style.profile_form__label}
											>
												Gemeente
											</label>
											<input
												name="city"
												id="city"
												className={style.profile_form__input}
												value={city}
												onChange={(e) => setCity(e.target.value)}
											/>
											<label
												htmlFor="country"
												className={style.profile_form__label}
											>
												Land
											</label>
											<input
												name="country"
												id="country"
												className={style.profile_form__input}
												value={country}
												onChange={(e) => setCountry(e.target.value)}
											/>
										</>
									) : (
										"Geen gebruiker gevonden"
									)}
								</div>
							</div>
							<div className={style.profile_form__buttons}>
								<a
									onClick={handleStopEdit}
									className={style.profile_form__cancel}
									href=""
								>
									Annuleren
								</a>
								<button className={style.edit_btn} type="submit">
									Gegevens opslaan
								</button>
							</div>
						</form>
					) : (
						<>
							<div className={style.info}>
								<div className={style.personal_info}>
									<h1 className={style.title}>Persoonlijke gegevens</h1>
									{UiStore.currentUser ? (
										<>
											<p className={style.personal_info__text}>
												<span className={style.personal_info__label}>
													Voornaam:
												</span>{" "}
												{UiStore.currentUser.firstname}
											</p>
											<p className={style.personal_info__text}>
												<span className={style.personal_info__label}>
													Achternaam:
												</span>{" "}
												{UiStore.currentUser.lastname}
											</p>
											<p className={style.personal_info__text}>
												<span className={style.personal_info__label}>
													Email:
												</span>{" "}
												{UiStore.currentUser.email}
											</p>
											<p className={style.personal_info__text}>
												<span className={style.personal_info__label}>
													Telefoonnummer:
												</span>{" "}
												{UiStore.currentUser.phone}
											</p>
										</>
									) : (
										"Geen gebruiker gevonden"
									)}
								</div>
								<div className={style.address_info}>
									<h1 className={style.title}>Adres</h1>
									{UiStore.currentUser ? (
										<>
											<p className={style.personal_info__text}>
												<span className={style.personal_info__label}>
													Straat en nummer:
												</span>{" "}
												{UiStore.currentUser.street_number ||
													"Geen straat gevonden"}
											</p>
											<p className={style.personal_info__text}>
												<span className={style.personal_info__label}>
													Postcode:
												</span>{" "}
												{UiStore.currentUser.postal_code ||
													"Geen postcode gevonden"}
											</p>
											<p className={style.personal_info__text}>
												<span className={style.personal_info__label}>
													Gemeente:
												</span>{" "}
												{UiStore.currentUser.city || "Geen gemeente gevonden"}
											</p>
											<p className={style.personal_info__text}>
												<span className={style.personal_info__label}>
													Land:
												</span>{" "}
												{UiStore.currentUser.country || "Geen land gevonden"}
											</p>
										</>
									) : (
										"Geen gebruiker gevonden"
									)}
								</div>
							</div>
							<button className={style.edit_btn} onClick={handleStartEdit}>
								Gegevens aanpassen
							</button>
						</>
					)}
				</div>
			</div>
		);
};

export default Profile;
